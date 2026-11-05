"use client";

import { signIn } from "next-auth/react";
import { safeRedirect } from "@/lib/safe-redirect";
import GoogleButton from "./google-button";
import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { validateLogin } from "@/lib/validation";

export default function LoginForm({ callbackUrl, onSwitch }) {
  const id = useId();
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const destination = safeRedirect(callbackUrl);

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    const data = new FormData(event.currentTarget);
    const payload = {
      email: String(data.get("email") ?? ""),
      password: String(data.get("password") ?? ""),
    };

    // Contrôle rapide côté navigateur (le serveur revalide de toute façon).
    const check = validateLogin(payload);
    if (!check.ok) {
      setFieldErrors(check.errors);
      return;
    }
    setFieldErrors({});
    setPending(true);

    try {
      const result = await signIn("credentials", {
        email: payload.email,
        password: payload.password,
        redirect: false,
      });

      if (!result || result.error) {
        setFormError(
          result?.code === "too_many_attempts"
            ? "Trop de tentatives. Réessayez dans 15 minutes."
            : "Adresse e-mail ou mot de passe incorrect.",
        );
        setPending(false);
        return;
      }

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
      {" "}
      <GoogleButton callbackUrl={destination} />
      {formError && (
        <p className="auth-alert" role="alert">
          {formError}
        </p>
      )}
      <div className="auth-field">
        <label htmlFor={`${id}-email`}>Adresse e-mail</label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="email"
          autoFocus
          required
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? `${id}-email-error` : undefined}
        />
        {fieldErrors.email && (
          <p id={`${id}-email-error`} className="auth-error">
            {fieldErrors.email}
          </p>
        )}
      </div>
      <div className="auth-field">
        <label htmlFor={`${id}-password`}>Mot de passe</label>
        <input
          id={`${id}-password`}
          name="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={Boolean(fieldErrors.password)}
          aria-describedby={
            fieldErrors.password ? `${id}-password-error` : undefined
          }
        />
        {fieldErrors.password && (
          <p id={`${id}-password-error`} className="auth-error">
            {fieldErrors.password}
          </p>
        )}
      </div>
      <button type="submit" className="auth-submit" disabled={pending}>
        {pending ? "Connexion…" : "Se connecter"}
      </button>
      <p className="auth-switch">
        Pas encore de compte ?{" "}
        <button type="button" onClick={onSwitch}>
          Créer un compte
        </button>
      </p>
    </form>
  );
}
