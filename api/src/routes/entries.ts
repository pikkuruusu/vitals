import { Router } from "express";
import { pool } from "../db";
import { Entry } from "../db/types";

const router = Router();

router.get('/', async (req, res) => {
  try {
    const userId = req.user?.sub;
    const result = await pool.query<Entry>(
      'select * from entries where user_id = $1 order by noted_at desc',
      [userId]
    )
    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  };
})

export default router;
