import { Router } from "express";
import { pool } from "../db";
import { Entry } from "../db/types";
import { validateDate, validateNumber } from "../utils/validation";

const router = Router();

router.get('/', async (req, res) => {
  try {
    const userId = req.user?.sub;
    const { from, to, limit, offset, metricId } = req.query;

    const conditions: string[] = []
    const limitOffset: string[] = []
    const params: unknown[] = [userId]
    let paramIndex = 2

    if (from) {
      if (!validateDate(from as string)) {
        return res.status(400).json({ error: 'Invalid from date' })
      }
      conditions.push(`noted_at::date >= $${paramIndex}`)
      params.push(from)
      paramIndex++
    }

    if (to) {
      if (!validateDate(to as string)) {
        return res.status(400).json({ error: 'Invalid to date' })
      }
      conditions.push(`noted_at::date <= $${paramIndex}`)
      params.push(to)
      paramIndex++
    }

    if (metricId) {
      conditions.push(`metric_id = $${paramIndex}`)
      params.push(metricId)
      paramIndex++
    }

    const whereClause = conditions.length > 0
    ? `AND ${conditions.join(' AND ')}`
    : ''

    if (!from && !to) {
      if (limit) {
        if (!validateNumber(parseInt(limit as string))) {
          return res.status(400).json({ error: 'Invalid limit' })
        }
        limitOffset.push(`LIMIT $${paramIndex}`)
        params.push(limit)
        paramIndex++
      } else {
        limitOffset.push(`LIMIT 100`)
      }
    }

    if (offset && !from && !to) {
      if (!validateNumber(parseInt(offset as string))) {
        return res.status(400).json({ error: 'Invalid offset' })
      }
      limitOffset.push(`OFFSET $${paramIndex}`)
      params.push(offset)
      paramIndex++
    }

    const limitOffsetClause = limitOffset.length > 0 ? limitOffset.join(' ') : ''

    const sql = `select * from entries where user_id = $1 ${whereClause} order by noted_at desc ${limitOffsetClause}`

    const result = await pool.query<Entry>(sql, params)

    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  };
})

router.post('/', async (req, res) => {
  try {
    const userId = req.user?.sub;
    const { metricId, value, comment, notedAt } = req.body;

    if (!metricId || value === undefined || notedAt === undefined) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    if (!validateDate(notedAt)) {
      return res.status(400).json({ error: 'Invalid date' })
    }

    if (!validateNumber(value)) {
      return res.status(400).json({ error: 'Value is not a valid number' })
    }

    const entryOnDateResult = await pool.query(
      `select * from entries where user_id = $1 and metric_id = $2 and noted_at::date = $3::date`,
      [userId, metricId, notedAt]
    )

    if (entryOnDateResult.rows.length > 0) {
      return res.status(409).json({ error: 'Entry for this metric already exists on the specified date' })
    }

    const result = await pool.query<Entry>(
      `insert into entries (user_id, metric_id, value, comment, noted_at)
      values ($1, $2, $3, $4, $5)
      returning *`,
      [userId, metricId, value, comment, notedAt]
    )

    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const userId = req.user?.sub;
    const entryId = req.params.id;
    const { value, comment, notedAt } = req.body;

    if (notedAt !== undefined && !validateDate(notedAt)) {
      return res.status(400).json({ error: 'Invalid date' })
    }

    if (value !== undefined && !validateNumber(value)) {
      return res.status(400).json({ error: 'Value is not a valid number' })
    }

    const newValues: string[] = []
    const params: unknown[] = [entryId, userId]
    let paramIndex = 3

    if (value !== undefined) {
      newValues.push(`value = $${paramIndex}`)
      params.push(value)
      paramIndex++
    }

    if (comment !== undefined) {
      newValues.push(`comment = $${paramIndex}`)
      params.push(comment)
      paramIndex++
    }

    if (notedAt !== undefined) {
      newValues.push(`noted_at = $${paramIndex}`)
      params.push(notedAt)
      paramIndex++
    }

    if (newValues.length === 0) {
      return res.status(400).json({ error: 'No fields to update' })
    }

    const sql = `update entries set ${newValues.join(', ')} where id = $1 and user_id = $2 returning *`

    const result = await pool.query<Entry>(sql, params)

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Entry not found' })
    }

    res.status(200).json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user?.sub;
    const entryId = req.params.id;

    const result = await pool.query(
      `delete from entries where id = $1 and user_id = $2 returning *`,
      [entryId, userId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Entry not found' })
    }

    res.status(204).send()
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router;
