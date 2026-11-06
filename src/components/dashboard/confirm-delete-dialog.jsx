"use client";

import { useEffect, useId, useRef, useState } from "react";
import Icon from "./dashboard-icons";

// Confirmation avant suppression. onConfirm() renvoie null ou { error }.
export default function ConfirmDeleteDialog({ task, onClose, onConfirm }) {
  const dialogRef = useRef(null);
  const id = useId();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  async function handleConfirm() {
    setPending(true);
    setError("");
    const failure = await onConfirm();
    if (failure) {
      setError(failure.error ?? "La suppression a échoué.");
      setPending(false);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="tf-dialog tf-dialog-small"
      aria-labelledby={`${id}-heading`}
      aria-describedby={`${id}-text`}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current.close();
      }}
    >
      <div className="tf-dialog-card tf-confirm">
        <span className="tf-sheet-handle" aria-hidden="true" />
        <span className="tf-confirm-icon">
          <Icon name="trash" size={24} />
        </span>
        <h2 id={`${id}-heading`}>Supprimer cette tâche ?</h2>
        <p className="tf-confirm-name">« {task.title} »</p>
        <p id={`${id}-text`} className="tf-confirm-text">
          Cette action est irréversible : la tâche sera définitivement supprimée.
        </p>
        {error && (
          <p className="tf-form-alert" role="alert">
            {error}
          </p>
        )}
        <div className="tf-dialog-actions">
          <button
            type="button"
            className="tf-secondary-button"
            onClick={() => dialogRef.current?.close()}
          >
            Annuler
          </button>
          <button
            type="button"
            className="tf-danger-button"
            disabled={pending}
            onClick={handleConfirm}
          >
            {pending ? "Suppression…" : "Supprimer"}
          </button>
        </div>
      </div>
    </dialog>
  );
}
