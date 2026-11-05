CREATE TABLE auth_attempts (
    id BIGSERIAL PRIMARY KEY,
    scope VARCHAR(20) NOT NULL,
    key VARCHAR(320) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_auth_attempts_lookup
    ON auth_attempts (scope, key, created_at);