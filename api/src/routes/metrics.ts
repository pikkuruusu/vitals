import { Router } from "express";
import { pool } from "../db";
import { Metric } from "../db/types";

const router = Router();

router.get('/', async (req, res) => {
  try {
    const result = await pool.query<Metric>(
      `select * from metrics order by name`
    )
    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router;
