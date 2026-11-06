// Validation partagée : serveur (source de vérité) et formulaire (confort).
// Ce fichier ne doit importer aucun module Node (il est aussi chargé côté client).

import {
  DEFAULT_PRIORITY,
  DEFAULT_STATUS,
  TASK_PRIORITIES,
  TASK_STATUSES,
} from "@/lib/task-constants";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const isUuid = (value) =>
  typeof value === "string" && UUID_RE.test(value);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isRealDate(value) {
  if (!DATE_RE.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

const text = (value) => (typeof value === "string" ? value.trim() : "");

export function validateTask(body) {
  const input = isPlainObject(body) ? body : {};
  const values = {
    title: text(input.title).replace(/\s+/g, " "),
    description: text(input.description),
    status: typeof input.status === "string" ? input.status : DEFAULT_STATUS,
    priority:
      typeof input.priority === "string" ? input.priority : DEFAULT_PRIORITY,
    dueDate: text(input.dueDate),
    category: text(input.category).replace(/\s+/g, " "),
  };
  const errors = {};

  if (!values.title) errors.title = "Le titre est obligatoire.";
  else if (values.title.length > 255) {
    errors.title = "Le titre ne peut pas dépasser 255 caractères.";
  }

  if (values.description.length > 2000) {
    errors.description = "La description ne peut pas dépasser 2000 caractères.";
  }
  if (!TASK_STATUSES.includes(values.status)) errors.status = "Statut invalide.";
  if (!TASK_PRIORITIES.includes(values.priority)) {
    errors.priority = "Priorité invalide.";
  }
  if (values.dueDate && !isRealDate(values.dueDate)) {
    errors.dueDate = "La date d'échéance est invalide.";
  }
  if (values.category.length > 60) {
    errors.category = "La catégorie ne peut pas dépasser 60 caractères.";
  }

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    values: {
      ...values,
      description: values.description || null,
      dueDate: values.dueDate || null,
      category: values.category || null,
    },
  };
}

export function validateStatus(body) {
  const status = isPlainObject(body) ? body.status : undefined;
  if (!TASK_STATUSES.includes(status)) {
    return { ok: false, errors: { status: "Statut invalide." } };
  }
  return { ok: true, errors: {}, values: { status } };
}
