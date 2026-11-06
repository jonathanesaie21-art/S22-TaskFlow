import { createHash } from "node:crypto";
import {
  normalizeEmail,
  validateLogin,
  validateRegister,
} from "@/lib/validation";
import { hashPassword, verifyPassword } from "@/lib/password";
import {
  createUser,
  findUserByEmail,
  findUserByGoogleId,
  linkGoogleAccount,
} from "@/models/user";
import {
  isRateLimited,
  recordAttemptFor,
  resetEmailAttempts,
} from "@/services/rate-limit-service";

// Sert à garder le même temps de réponse quand l'e-mail n'existe pas.
const dummyHash = hashPassword("mot-de-passe-factice-1");

export class RateLimitedError extends Error {
  constructor() {
    super("Trop de tentatives.");
    this.name = "RateLimitedError";
  }
}

// Empreinte du mot de passe : stockée dans la session. Si le mot de passe
// change ou disparaît (liaison Google), les anciennes sessions deviennent invalides.
export function passwordFingerprint(user) {
  return createHash("sha256")
    .update(user?.password_hash ?? "none")
    .digest("hex")
    .slice(0, 16);
}

export async function registerUser(body) {
  const check = validateRegister(body);
  if (!check.ok) {
    return { ok: false, status: 400, fieldErrors: check.errors };
  }

  const { name, email, password } = check.values;
  const taken = {
    ok: false,
    status: 409,
    fieldErrors: { email: "Un compte existe déjà avec cette adresse e-mail." },
  };

  if (await findUserByEmail(email)) return taken;

  const passwordHash = await hashPassword(password);
  try {
    await createUser({ nom: name, email, passwordHash });
  } catch (error) {
    if (error.code === "23505") return taken; // e-mail déjà pris (course)
    throw error;
  }
  return { ok: true };
}

export async function authenticateCredentials(credentials, ip) {
  const check = validateLogin(credentials);
  if (!check.ok) return null;

  const { email, password } = check.values;
  const keys = { ip, email };

  if (await isRateLimited("login", keys)) throw new RateLimitedError();

  const user = await findUserByEmail(email);
  const hash = user?.password_hash ?? (await dummyHash);
  const valid = await verifyPassword(password, hash);

  if (!user || !user.password_hash || !valid) {
    await recordAttemptFor("login", keys);
    return null;
  }

  await resetEmailAttempts("login", email);
  return {
    id: user.id,
    name: user.nom,
    email: user.email,
    image: user.image,
    pv: passwordFingerprint(user),
  };
}

// Retourne true si la connexion Google est acceptée.
export async function signInWithGoogle(profile) {
  const email = normalizeEmail(profile?.email);
  const googleId = profile?.sub;

  // On n'accepte que les e-mails confirmés par Google.
  if (!email || !googleId || profile.email_verified !== true) return false;

  if (await findUserByGoogleId(googleId)) return true;

  const existing = await findUserByEmail(email);
  if (existing) {
    if (existing.google_id) return false; // déjà lié à un autre compte Google
    await linkGoogleAccount(existing.id, { googleId, image: profile.picture });
    return true;
  }

  await createUser({
    nom:
      String(profile.name ?? "")
        .trim()
        .slice(0, 100) || email.split("@")[0],
    email,
    googleId,
    image: profile.picture ?? null,
  });
  return true;
}
