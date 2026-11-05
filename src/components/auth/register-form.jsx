"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { validateRegister } from "@/lib/validation";

const FIELDS = [
  { name: "name", label: "Nom", type: "text", autoComplete: "name" },
  {
    name: "email",
    label: "Adresse e-mail",
    type: "email",
    autoComplete: "email",
  },
  {
    name: "password",
    label: "Mot de passe",
    type: "password",
    autoComplete: "new-password",
    hint: "8 caractères minimum, avec au moins une lettre et un chiffre.",
  },
  {
    name: "confirmPassword",
    label: "Confirmer le mot de passe",
    type: "password",
    autoComplete: "new-password",
  },
];

export default function RegisterForm({ onSwitch }) {
  const id = useId();
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState(false);

  const router = useRouter();

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    const data = new FormData(event.currentTarget);
    const payload = Object.fromEntries(
      FIELDS.map(({ name }) => [name, String(data.get(name) ?? "")]),
    );

    const check = validateRegister(payload);
    if (!check.ok) {
      setFieldErrors(check.errors);
      return;
    }
    setFieldErrors({});
    setPending(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        setFieldErrors(result.fieldErrors ?? {});
        setFormError(
          result.fieldErrors
            ? ""
            : (result.error ?? "Inscription impossible. Réessayez."),
        );
        setPending(false);
        return;
      }

      // Le compte est créé et la session ouverte.
      router.push(destination);
      router.refresh();
    } catch {
      setFormError(
        "Impossible de joindre le serveur. Vérifiez votre connexion.",
      );
      setPending(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      {formError && (
        <p className="auth-alert" role="alert">
          {formError}
        </p>
      )}

      {FIELDS.map(({ name, label, type, autoComplete, hint }, index) => {
        const error = fieldErrors[name];
        const describedBy =
          [error && `${id}-${name}-error`, hint && `${id}-${name}-hint`]
            .filter(Boolean)
            .join(" ") || undefined;

        return (
          <div className="auth-field" key={name}>
            <label htmlFor={`${id}-${name}`}>{label}</label>
            <input
              id={`${id}-${name}`}
              name={name}
              type={type}
              autoComplete={autoComplete}
              autoFocus={index === 0}
              required
              aria-invalid={Boolean(error)}
              aria-describedby={describedBy}
            />
            {hint && (
              <p id={`${id}-${name}-hint`} className="auth-hint">
                {hint}
              </p>
            )}
            {error && (
              <p id={`${id}-${name}-error`} className="auth-error">
                {error}
              </p>
            )}
          </div>
        );
      })}

      <button type="submit" className="auth-submit" disabled={pending}>
        {pending ? "Création du compte…" : "Créer mon compte"}
      </button>

      <p className="auth-switch">
        Déjà inscrit ?{" "}
        <button type="button" onClick={onSwitch}>
          Se connecter
        </button>
      </p>
    </form>
  );
}
