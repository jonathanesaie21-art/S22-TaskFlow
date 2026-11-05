export async function findUserById(id) {
  const { rows } = await pool.query(
    `SELECT ${COLUMNS} FROM users WHERE id = $1`,
    [id],
  );
  return rows[0] ?? null;
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
