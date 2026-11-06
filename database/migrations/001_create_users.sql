CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NULL,
    google_id VARCHAR(255) UNIQUE NULL,
    image TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);