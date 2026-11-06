import { NextResponse } from "next/server";
import { getClientIp } from "@/lib/client-ip";
import { registerUser } from "@/services/auth-service";
import { isRateLimited, recordAttemptFor } from "@/services/rate-limit-service";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  try {
    const keys = { ip: getClientIp(request.headers) };

    if (await isRateLimited("register", keys)) {
      return NextResponse.json(
        { error: "Trop de tentatives. Réessayez dans une heure." },
        { status: 429 },
      );
    }
    await recordAttemptFor("register", keys);

    const result = await registerUser(body);
    if (!result.ok) {
      return NextResponse.json(
        { fieldErrors: result.fieldErrors },
        { status: result.status },
      );
    }
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Erreur d'inscription :", error);
    return NextResponse.json(
      { error: "Erreur serveur. Réessayez plus tard." },
      { status: 500 },
    );
  }
}
