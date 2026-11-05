"use client";

import { useEffect, useId, useRef } from "react";
import "./auth.css";

// Modal basé sur l'élément natif <dialog> : piège du focus, fermeture avec
// Échap et rôle "dialog" sont gérés par le navigateur.
export default function AuthModal({ title, onClose, children }) {
  const dialogRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="auth-dialog"
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        // Un clic sur le fond (le <dialog> lui-même) ferme le modal.
        if (event.target === dialogRef.current) dialogRef.current.close();
      }}
    >
      <div className="auth-card">
        <button
          type="button"
          className="auth-close"
          aria-label="Fermer"
          onClick={() => dialogRef.current?.close()}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
        <h2 id={titleId} className="auth-title">
          {title}
        </h2>
        {children}
      </div>
    </dialog>
  );
}
