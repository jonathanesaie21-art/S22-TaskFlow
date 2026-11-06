import pool from "@/lib/db";

const COLUMNS = "id, nom, email, password_hash, google_id, image, created_at";

export async function findUserByEmail(email) {
  const { rows } = await pool.query(
    `SELECT ${COLUMNS} FROM users WHERE email = $1`,
    [email],
  );
  return rows[0] ?? null;
}

export async function findUserByGoogleId(googleId) {
  const { rows } = await pool.query(
    `SELECT ${COLUMNS} FROM users WHERE google_id = $1`,
    [googleId],
  );
  return rows[0] ?? null;
}

export async function findUserById(id) {
  const { rows } = await pool.query(
    `SELECT ${COLUMNS} FROM users WHERE id = $1`,
    [id],
  );
  return rows[0] ?? null;
}

export async function createUser({
  nom,
  email,
  passwordHash = null,
  googleId = null,
  image = null,
}) {
  const { rows } = await pool.query(
    `INSERT INTO users (nom, email, password_hash, google_id, image)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING ${COLUMNS}`,
    [nom, email, passwordHash, googleId, image],
  );
  return rows[0];
}

// Le mot de passe est supprimé à la liaison : si quelqu'un avait créé le compte
// avec l'e-mail d'un autre, il perd son accès dès que le vrai propriétaire
// se connecte avec Google.
export async function linkGoogleAccount(id, { googleId, image }) {
  const { rows } = await pool.query(
    `UPDATE users
     SET google_id = $2, image = COALESCE(image, $3), password_hash = NULL
     WHERE id = $1
     RETURNING ${COLUMNS}`,
    [id, googleId, image ?? null],
  );
  return rows[0] ?? null;
}
