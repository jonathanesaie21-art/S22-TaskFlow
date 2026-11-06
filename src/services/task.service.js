import {
  deleteTaskById,
  insertTask,
  listTasksByUser,
  updateTaskById,
  updateTaskStatusById,
} from "@/models/task";
import { isUuid, validateStatus, validateTask } from "@/lib/task-validation";

const NOT_FOUND = { ok: false, status: 404, error: "Tâche introuvable." };

// Récupère uniquement les tâches appartenant à l'utilisateur demandé.
export async function getUserTasks(userId) {
  return listTasksByUser(userId);
}

export async function createUserTask(userId, body) {
  const check = validateTask(body);
  if (!check.ok) return { ok: false, status: 400, fieldErrors: check.errors };

  const task = await insertTask(userId, check.values);
  return { ok: true, task };
}

export async function updateUserTask(userId, id, body) {
  if (!isUuid(id)) return NOT_FOUND;

  // Un corps réduit à { status } sert au changement rapide de statut.
  const keys = body && typeof body === "object" ? Object.keys(body) : [];
  if (keys.length === 1 && keys[0] === "status") {
    const check = validateStatus(body);
    if (!check.ok) return { ok: false, status: 400, fieldErrors: check.errors };
    const task = await updateTaskStatusById(userId, id, check.values.status);
    return task ? { ok: true, task } : NOT_FOUND;
  }

  const check = validateTask(body);
  if (!check.ok) return { ok: false, status: 400, fieldErrors: check.errors };
  const task = await updateTaskById(userId, id, check.values);
  return task ? { ok: true, task } : NOT_FOUND;
}

export async function deleteUserTask(userId, id) {
  if (!isUuid(id)) return NOT_FOUND;
  const deleted = await deleteTaskById(userId, id);
  return deleted ? { ok: true } : NOT_FOUND;
}
