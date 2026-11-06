import { NextResponse } from "next/server";
import {
  failure,
  getSessionUserId,
  readJson,
  serverError,
  unauthorized,
} from "@/lib/api-session";
import { deleteUserTask, updateUserTask } from "@/services/task.service";

export async function PATCH(request, { params }) {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const { id } = await params;
  const parsed = await readJson(request);
  if (parsed.error) return parsed.error;

  try {
    const result = await updateUserTask(userId, id, parsed.body);
    if (!result.ok) return failure(result);
    return NextResponse.json({ task: result.task });
  } catch (error) {
    console.error("Erreur de modification de tâche :", error);
    return serverError();
  }
}

export async function DELETE(_request, { params }) {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const { id } = await params;

  try {
    const result = await deleteUserTask(userId, id);
    if (!result.ok) return failure(result);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erreur de suppression de tâche :", error);
    return serverError();
  }
}
