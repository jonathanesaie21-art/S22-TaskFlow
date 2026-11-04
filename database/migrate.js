import 'dotenv/config';

import pg from 'pg';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const { Pool } = pg;

// Chemins des dossiers
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrationsDir = path.join(__dirname, 'migrations');

// Configuration PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Convention : 001-create-users.sql
const MIGRATION_REGEX = /^(\d{3})_([a-z0-9]+(?:_[a-z0-9]+)*)\.sql$/i;

/**
 * Crée la table de suivi des migrations si elle n'existe pas.
 */
async function createMigrationsTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version VARCHAR(3) PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  console.log('Table schema_migrations vérifiée.');
}

/**
 * Récupère les migrations présentes dans le dossier.
 */
async function getMigrationFiles() {
  const files = await fs.readdir(migrationsDir);

  const migrations = [];

  for (const file of files) {
    // On ignore les fichiers qui ne sont pas des .sql
    if (!file.endsWith('.sql')) {
      continue;
    }

    const match = file.match(MIGRATION_REGEX);

    if (!match) {
      throw new Error(
        `Nom de migration invalide : ${file}. ` +
        'Format attendu : 001_nom_de_migration.sql'
      );
    }

    migrations.push({
      version: match[1],
      name: file,
      path: path.join(migrationsDir, file),
    });
  }

  // Tri numérique des migrations
  migrations.sort(
    (a, b) => Number(a.version) - Number(b.version)
  );

  // Vérification des numéros en double
  for (let i = 1; i < migrations.length; i++) {
    if (migrations[i].version === migrations[i - 1].version) {
      throw new Error(
        `Numéro de migration dupliqué : ${migrations[i].version}`
      );
    }
  }

  return migrations;
}

/**
 * Récupère les migrations déjà appliquées.
 */
async function getAppliedMigrations(client) {
  const result = await client.query(`
    SELECT version, applied_at
    FROM schema_migrations
    ORDER BY version ASC;
  `);

  return result.rows;
}

/**
 * Exécute une migration dans une transaction.
 */
async function runMigration(client, migration) {
  const sql = await fs.readFile(migration.path, 'utf-8');

  console.log(`\nExécution : ${migration.name}`);

  try {
    await client.query('BEGIN');

    // Exécution du contenu SQL
    await client.query(sql);

    // Enregistrement de la migration
    await client.query(
      `INSERT INTO schema_migrations (version)
       VALUES ($1)`,
      [migration.version]
    );

    await client.query('COMMIT');

    console.log(`Migration ${migration.version} appliquée avec succès.`);
  } catch (error) {
    await client.query('ROLLBACK');

    throw new Error(
      `Échec de la migration ${migration.name} : ${error.message}`
    );
  }
}

/**
 * Fonction principale.
 */
async function migrate() {
  const client = await pool.connect();

  try {
    console.log('\n===== MIGRATIONS DATABASE =====\n');

    // 1. Création de la table de suivi
    await createMigrationsTable(client);

    // 2. Lecture des migrations du dossier
    const migrations = await getMigrationFiles();

    // 3. Lecture des migrations déjà appliquées
    const appliedMigrations = await getAppliedMigrations(client);

    console.log('\nMigrations déjà appliquées :');

    if (appliedMigrations.length === 0) {
      console.log('Aucune migration appliquée.');
    } else {
      for (const migration of appliedMigrations) {
        console.log(
          `- ${migration.version} | ${migration.applied_at.toISOString()}`
        );
      }
    }

    // 4. Identification des migrations restantes
    const appliedVersions = new Set(
      appliedMigrations.map((migration) => migration.version)
    );

    const pendingMigrations = migrations.filter(
      (migration) => !appliedVersions.has(migration.version)
    );

    if (pendingMigrations.length === 0) {
      console.log('\nToutes les migrations sont déjà appliquées.');
      return;
    }

    console.log(`\n${pendingMigrations.length} migration(s) à exécuter.`);

    // 5. Exécution des migrations restantes
    for (const migration of pendingMigrations) {
      await runMigration(client, migration);
    }

    console.log('\nToutes les migrations ont été exécutées.');
  } catch (error) {
    console.error('\nErreur pendant les migrations :');
    console.error(error.message);

    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
