import { FileMigrationProvider, Migrator } from "kysely";
import { db } from "../db";
import { promises as fs } from "fs";
import path from "path";

const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs,
    path,
    migrationFolder: path.join(__dirname, "../../../migrations")
  }),
});

export async function migrateToLatest() {
  const { error, results } = await migrator.migrateToLatest();

  results?.forEach(r => {
    if (r.status === "Success") {
      console.log(`Migration ${r.migrationName} ran successfully.`);
    } else if (r.status === "Error") {
      console.error(`Migration ${r.migrationName} failed`);
    }
  });

  if (error) {
    console.error("Migration failed with error:", error);
    process.exit(1);
  }

  await db.destroy();

}

migrateToLatest();
