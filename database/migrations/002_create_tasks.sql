CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    utilisateur_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    titre VARCHAR(255) NOT NULL,
    description TEXT NULL,
    statut VARCHAR(20) NOT NULL DEFAULT 'À faire'
        CHECK (statut IN ('À faire', 'En cours', 'Terminé')),
    priorite VARCHAR(20) NOT NULL DEFAULT 'Moyenne'
        CHECK (priorite IN ('Basse', 'Moyenne', 'Haute')),
    date_limite TIMESTAMPTZ NULL,
    date_creation TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    date_modification TIMESTAMPTZ NOT NULL DEFAULT NOW()
);