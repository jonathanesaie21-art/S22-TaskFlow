import { NextResponse } from "next/server";
import { auth } from "@/auth";

// Identifiant de l'utilisateur connecté, lu dans la session (jamais dans la requête).
export async function getSessionUserId() {
  const session = await auth();
  return session?.user?.id ?? null;
}

export const unauthorized = () =>
  NextResponse.json({ error: "Connexion requise." }, { status: 401 });

export const serverError = () =>
  NextResponse.json(
    { error: "Erreur serveur. Réessayez plus tard." },
    { status: 500 },
  );

// Traduit le résultat d'un service en réponse HTTP.
export function failure(result) {
  const payload = result.fieldErrors
    ? { fieldErrors: result.fieldErrors }
    : { error: result.error };
  return NextResponse.json(payload, { status: result.status });
}

export async function readJson(request) {
  try {
    return { body: await request.json() };
  } catch {
    return { error: NextResponse.json({ error: "Requête invalide." }, { status: 400 }) };
  }
}
