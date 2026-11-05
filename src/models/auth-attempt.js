import pool from "@/lib/db";

export async function countAttempts(scope, key, windowMs) {
  const { rows } = await pool.query(
    `SELECT COUNT(*)::int AS n FROM auth_attempts
     WHERE scope = $1 AND key = $2
       AND created_at > NOW() - ($3::double precision * INTERVAL '1 millisecond')`,
    [scope, key, windowMs],
  );
  return rows[0].n;
}

export async function recordAttempt(scope, key) {
  await pool.query("INSERT INTO auth_attempts (scope, key) VALUES ($1, $2)", [
    scope,
    key,
  ]);
}

export async function clearAttempts(scope, key) {
  await pool.query("DELETE FROM auth_attempts WHERE scope = $1 AND key = $2", [
    scope,
    key,
  ]);
}

export async function purgeOldAttempts() {
  await pool.query(
    "DELETE FROM auth_attempts WHERE created_at < NOW() - INTERVAL '1 day'",
  );
}
