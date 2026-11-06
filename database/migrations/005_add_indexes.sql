CREATE INDEX IF NOT EXISTS idx_tasks_user_created ON tasks (utilisateur_id, date_creation DESC);
CREATE INDEX IF NOT EXISTS idx_auth_attempts_lookup ON auth_attempts (scope, key, created_at);