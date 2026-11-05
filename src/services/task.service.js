// Utilise le pool PostgreSQL partagé de l'application.
import pool from "@/lib/db";
// Récupère uniquement les tâches appartenant à l'utilisateur demandé.
export async function getUserTasks(userId) {
  const result = await pool.query(
    `
      SELECT
        id,
        utilisateur_id,
        titre AS title,
        status,
        priorite,
        date_limite::text AS "dueDate",
        date_creation,
        date_modification
      FROM tasks
      WHERE user_id = $1
      ORDER BY created_at DESC
    `,
    [userId]
  );
 // Retourne uniquement les lignes de tâches trouvées.
  return result.rows;
}