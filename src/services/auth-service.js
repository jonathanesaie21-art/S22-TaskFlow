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

// Sert à garder le même temps de réponse quand l'e-mail n'existe pas.
const dummyHash = hashPassword("mot-de-passe-factice-1");

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

export async function authenticateCredentials(credentials) {
  const check = validateLogin(credentials);
  if (!check.ok) return null;

  const user = await findUserByEmail(check.values.email);
  const hash = user?.password_hash ?? (await dummyHash);
  const valid = await verifyPassword(check.values.password, hash);

  if (!user || !user.password_hash || !valid) return null;
  return { id: user.id, name: user.nom, email: user.email, image: user.image };
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
