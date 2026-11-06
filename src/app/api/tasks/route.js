import { NextResponse } from "next/server";
import {
  failure,
  getSessionUserId,
  readJson,
  serverError,
  unauthorized,
} from "@/lib/api-session";
import { createUserTask, getUserTasks } from "@/services/task.service";

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  try {
    return NextResponse.json({ tasks: await getUserTasks(userId) });
  } catch (error) {
    console.error("Erreur de lecture des tâches :", error);
    return serverError();
  }
}

export async function POST(request) {
  const userId = await getSessionUserId();
  if (!userId) return unauthorized();

  const parsed = await readJson(request);
  if (parsed.error) return parsed.error;

  try {
    const result = await createUserTask(userId, parsed.body);
    if (!result.ok) return failure(result);
    return NextResponse.json({ task: result.task }, { status: 201 });
  } catch (error) {
    console.error("Erreur de création de tâche :", error);
    return serverError();
  }
}
