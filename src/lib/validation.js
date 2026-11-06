// Validation partagée : utilisée côté serveur (source de vérité) et côté
// formulaire (confort). Ne jamais faire confiance au seul contrôle du navigateur.
// Ce fichier ne doit importer aucun module Node (il est aussi chargé côté client).

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const normalizeEmail = (value) => String(value ?? "").trim().toLowerCase();

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function checkEmail(email) {
  if (!email) return "L'adresse e-mail est obligatoire.";
  if (email.length > 254 || !EMAIL_RE.test(email)) {
    return "Saisissez une adresse e-mail valide.";
  }
  return null;
}

export function validateRegister(body) {
  const input = isPlainObject(body) ? body : {};
  const values = {
    name: String(input.name ?? "").trim().replace(/\s+/g, " "),
    email: normalizeEmail(input.email),
    password: typeof input.password === "string" ? input.password : "",
    confirmPassword:
      typeof input.confirmPassword === "string" ? input.confirmPassword : "",
  };
  const errors = {};

  if (values.name.length < 2 || values.name.length > 60) {
    errors.name = "Le nom doit contenir entre 2 et 60 caractères.";
  }

  const emailError = checkEmail(values.email);
  if (emailError) errors.email = emailError;

  if (values.password.length < 8 || values.password.length > 128) {
    errors.password = "Le mot de passe doit contenir entre 8 et 128 caractères.";
  } else if (!/[A-Za-z]/.test(values.password) || !/\d/.test(values.password)) {
    errors.password = "Le mot de passe doit contenir au moins une lettre et un chiffre.";
  }

  if (!errors.password && values.confirmPassword !== values.password) {
    errors.confirmPassword = "Les mots de passe ne correspondent pas.";
  }

  return { ok: Object.keys(errors).length === 0, errors, values };
}

export function validateLogin(body) {
  const input = isPlainObject(body) ? body : {};
  const values = {
    email: normalizeEmail(input.email),
    password: typeof input.password === "string" ? input.password : "",
  };
  const errors = {};

  const emailError = checkEmail(values.email);
  if (emailError) errors.email = emailError;

  if (!values.password || values.password.length > 128) {
    errors.password = "Le mot de passe est obligatoire.";
  }

  return { ok: Object.keys(errors).length === 0, errors, values };
}
