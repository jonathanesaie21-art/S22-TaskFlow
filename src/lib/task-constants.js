// Valeurs contrôlées : elles doivent rester identiques aux contraintes CHECK
// de la table tasks (database/migrations/002_create_tasks.sql).
// Ce fichier est aussi chargé côté client : aucun module Node ici.

export const TASK_STATUSES = ["À faire", "En cours", "Terminé"];
export const TASK_PRIORITIES = ["Basse", "Moyenne", "Haute"];

export const DEFAULT_STATUS = "À faire";
export const DEFAULT_PRIORITY = "Moyenne";

export const PAGE_SIZE = 10;

// Libellés d'affichage et clés de style (voir dashboard.css).
export const STATUS_META = {
  "À faire": { label: "À faire", key: "todo" },
  "En cours": { label: "En cours", key: "progress" },
  Terminé: { label: "Terminée", key: "done" },
};

export const PRIORITY_META = {
  Basse: { label: "Basse", key: "low" },
  Moyenne: { label: "Moyenne", key: "medium" },
  Haute: { label: "Haute", key: "high" },
};

// À faire -> En cours -> Terminé -> À faire
export function nextStatus(status) {
  const index = TASK_STATUSES.indexOf(status);
  return TASK_STATUSES[(index + 1) % TASK_STATUSES.length];
}
