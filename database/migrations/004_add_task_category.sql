-- Categorie libre d'une tache (affichee sous le titre dans le tableau).
ALTER TABLE tasks
    ADD COLUMN categorie VARCHAR(60) NULL;

-- Accelere la liste des taches d'un utilisateur, triee par date de creation.
CREATE INDEX idx_tasks_utilisateur_creation
    ON tasks (utilisateur_id, date_creation DESC);