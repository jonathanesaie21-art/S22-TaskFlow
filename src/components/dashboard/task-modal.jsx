"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  DEFAULT_PRIORITY,
  DEFAULT_STATUS,
  PRIORITY_META,
  STATUS_META,
  TASK_PRIORITIES,
  TASK_STATUSES,
} from "@/lib/task-constants";
import { validateTask } from "@/lib/task-validation";
import Icon from "./dashboard-icons";

// Une seule modale pour la création et la modification.
// onSubmit(values) renvoie null en cas de succès, sinon { fieldErrors?, error? }.
export default function TaskModal({ task, onClose, onSubmit }) {
  const dialogRef = useRef(null);
  const id = useId();
  const editing = Boolean(task);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    const data = new FormData(event.currentTarget);
    const payload = {
      title: String(data.get("title") ?? ""),
      description: String(data.get("description") ?? ""),
      status: String(data.get("status") ?? ""),
      priority: String(data.get("priority") ?? ""),
      dueDate: String(data.get("dueDate") ?? ""),
      category: String(data.get("category") ?? ""),
    };

    const check = validateTask(payload);
    if (!check.ok) {
      setFieldErrors(check.errors);
      return;
    }
    setFieldErrors({});
    setPending(true);

    const failure = await onSubmit(payload);
    if (failure) {
      setFieldErrors(failure.fieldErrors ?? {});
      setFormError(failure.error ?? "");
      setPending(false);
    }
  }

  const describe = (name) => (fieldErrors[name] ? `${id}-${name}-error` : undefined);
  const errorFor = (name) =>
    fieldErrors[name] && (
      <p id={`${id}-${name}-error`} className="tf-field-error">
        {fieldErrors[name]}
      </p>
    );

  return (
    <dialog
      ref={dialogRef}
      className="tf-dialog"
      aria-labelledby={`${id}-heading`}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current.close();
      }}
    >
      <form className="tf-dialog-card" onSubmit={handleSubmit} noValidate>
        <span className="tf-sheet-handle" aria-hidden="true" />
        <header className="tf-dialog-head">
          <h2 id={`${id}-heading`}>{editing ? "Modifier la tâche" : "Nouvelle tâche"}</h2>
          <button
            type="button"
            className="tf-icon-button"
            aria-label="Fermer"
            onClick={() => dialogRef.current?.close()}
          >
            <Icon name="close" size={18} />
          </button>
        </header>

        {formError && (
          <p className="tf-form-alert" role="alert">
            {formError}
          </p>
        )}

        <div className="tf-field">
          <label htmlFor={`${id}-title`}>Titre</label>
          <input
            id={`${id}-title`}
            name="title"
            type="text"
            defaultValue={task?.title ?? ""}
            autoFocus
            required
            maxLength={255}
            aria-invalid={Boolean(fieldErrors.title)}
            aria-describedby={describe("title")}
          />
          {errorFor("title")}
        </div>

        <div className="tf-field">
          <label htmlFor={`${id}-description`}>Description</label>
          <textarea
            id={`${id}-description`}
            name="description"
            rows={3}
            defaultValue={task?.description ?? ""}
            aria-invalid={Boolean(fieldErrors.description)}
            aria-describedby={describe("description")}
          />
          {errorFor("description")}
        </div>

        <div className="tf-field-row">
          <div className="tf-field">
            <label htmlFor={`${id}-status`}>Statut</label>
            <select id={`${id}-status`} name="status" defaultValue={task?.status ?? DEFAULT_STATUS}>
              {TASK_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {STATUS_META[status].label}
                </option>
              ))}
            </select>
          </div>
          <div className="tf-field">
            <label htmlFor={`${id}-priority`}>Priorité</label>
            <select id={`${id}-priority`} name="priority" defaultValue={task?.priority ?? DEFAULT_PRIORITY}>
              {TASK_PRIORITIES.map((priority) => (
                <option key={priority} value={priority}>
                  {PRIORITY_META[priority].label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="tf-field-row">
          <div className="tf-field">
            <label htmlFor={`${id}-dueDate`}>Échéance</label>
            <input
              id={`${id}-dueDate`}
              name="dueDate"
              type="date"
              defaultValue={task?.dueDate ?? ""}
              aria-invalid={Boolean(fieldErrors.dueDate)}
              aria-describedby={describe("dueDate")}
            />
            {errorFor("dueDate")}
          </div>
          <div className="tf-field">
            <label htmlFor={`${id}-category`}>Catégorie</label>
            <input
              id={`${id}-category`}
              name="category"
              type="text"
              maxLength={60}
              defaultValue={task?.category ?? ""}
              aria-invalid={Boolean(fieldErrors.category)}
              aria-describedby={describe("category")}
            />
            {errorFor("category")}
          </div>
        </div>

        <footer className="tf-dialog-actions">
          <button
            type="button"
            className="tf-secondary-button"
            onClick={() => dialogRef.current?.close()}
          >
            Annuler
          </button>
          <button type="submit" className="tf-primary-button" disabled={pending}>
            {pending ? "Enregistrement…" : editing ? "Enregistrer" : "Créer la tâche"}
          </button>
        </footer>
      </form>
    </dialog>
  );
}
