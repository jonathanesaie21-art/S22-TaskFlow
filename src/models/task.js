import pool from "@/lib/db";

// Colonnes renvoyées à l'application, avec les noms utilisés par l'interface.
// date_limite est stockée à minuit UTC : on la relit en UTC pour éviter tout décalage.
const COLUMNS = `
  id,
  titre AS title,
  COALESCE(description, '') AS description,
  statut AS status,
  priorite AS priority,
  to_char(date_limite AT TIME ZONE 'UTC', 'YYYY-MM-DD') AS "dueDate",
  COALESCE(categorie, '') AS category
`;

const toTimestamp = (dueDate) => (dueDate ? `${dueDate}T00:00:00Z` : null);

// Toutes les requêtes filtrent sur utilisateur_id : une tâche n'est jamais
// lue ni modifiée par un autre utilisateur que son propriétaire.

export async function listTasksByUser(userId) {
  const { rows } = await pool.query(
    `SELECT ${COLUMNS} FROM tasks
     WHERE utilisateur_id = $1
     ORDER BY date_creation DESC, id`,
    [userId],
  );
  return rows;
}

export async function insertTask(userId, values) {
  const { rows } = await pool.query(
    `INSERT INTO tasks
       (utilisateur_id, titre, description, statut, priorite, date_limite, categorie)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING ${COLUMNS}`,
    [
      userId,
      values.title,
      values.description,
      values.status,
      values.priority,
      toTimestamp(values.dueDate),
      values.category,
    ],
  );
  return rows[0];
}

export async function updateTaskById(userId, id, values) {
  const { rows } = await pool.query(
    `UPDATE tasks
     SET titre = $3, description = $4, statut = $5, priorite = $6,
         date_limite = $7, categorie = $8, date_modification = NOW()
     WHERE id = $1 AND utilisateur_id = $2
     RETURNING ${COLUMNS}`,
    [
      id,
      userId,
      values.title,
      values.description,
      values.status,
      values.priority,
      toTimestamp(values.dueDate),
      values.category,
    ],
  );
  return rows[0] ?? null;
}

export async function updateTaskStatusById(userId, id, status) {
  const { rows } = await pool.query(
    `UPDATE tasks
     SET statut = $3, date_modification = NOW()
     WHERE id = $1 AND utilisateur_id = $2
     RETURNING ${COLUMNS}`,
    [id, userId, status],
  );
  return rows[0] ?? null;
}

export async function deleteTaskById(userId, id) {
  const result = await pool.query(
    "DELETE FROM tasks WHERE id = $1 AND utilisateur_id = $2",
    [id, userId],
  );
  return result.rowCount > 0;
}
