import {
  clearAttempts,
  countAttempts,
  purgeOldAttempts,
  recordAttempt,
} from "@/models/auth-attempt";

const RULES = {
  // Connexion : on compte les échecs, par adresse IP et par e-mail.
  login: { windowMs: 15 * 60 * 1000, limits: { ip: 20, email: 5 } },
  // Inscription : on compte chaque tentative, par adresse IP.
  register: { windowMs: 60 * 60 * 1000, limits: { ip: 10 } },
};

const keyOf = (type, value) => `${type}:${value}`;

// keys = { ip: "...", email: "..." }
export async function isRateLimited(scope, keys) {
  const { windowMs, limits } = RULES[scope];
  for (const [type, max] of Object.entries(limits)) {
    if (!keys[type]) continue;
    const count = await countAttempts(scope, keyOf(type, keys[type]), windowMs);
    if (count >= max) return true;
  }
  return false;
}

export async function recordAttemptFor(scope, keys) {
  const { limits } = RULES[scope];
  await Promise.all(
    Object.keys(limits)
      .filter((type) => keys[type])
      .map((type) => recordAttempt(scope, keyOf(type, keys[type]))),
  );
  // Nettoyage occasionnel des vieilles lignes.
  if (Math.random() < 0.05) await purgeOldAttempts();
}

// Après une connexion réussie, on remet à zéro le compteur de cet e-mail.
export async function resetEmailAttempts(scope, email) {
  await clearAttempts(scope, keyOf("email", email));
}
