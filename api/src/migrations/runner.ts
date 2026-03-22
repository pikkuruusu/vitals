import 'dotenv/config'

import { pool } from "../db";
import { promises as fs } from "fs";
import path from "path";

async function runMigrations() {
  const client = await pool.connect();

  try {
    await client.query(`
      create table if not exists migrations (
        name text primary key,
        ran_at timestamptz default now() not null
      )
    `)

    const migrationsDir = path.join(__dirname, '../../../migrations')
    const files = await fs.readdir(migrationsDir)
    const sqlFiles = files
      .filter(f => f.endsWith('.sql'))
      .sort()

    for (const file of sqlFiles) {
      const result = await client.query(
        'select name from migrations where name = $1',
        [file]
      )

      if (result.rows.length > 0) {
        console.log(`Skipping ${file}`)
        continue
      }

      const filePath = path.join(migrationsDir, file)
      const sql = await fs.readFile(filePath, 'utf-8')

      await client.query('begin')
      await client.query(sql)
      await client.query(
        'insert into migrations (name) values ($1)',
        [file]
      )
      await client.query('commit')

      console.log(`Ran migration: ${file}`)
    }
  } catch (error) {
    await client.query('rollback')
    console.error('Migration failed:', error)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

runMigrations()
