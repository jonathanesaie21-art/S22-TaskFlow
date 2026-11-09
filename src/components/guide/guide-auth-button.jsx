"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AuthButton } from "@/components/auth/auth-provider";

// Bouton « Se connecter » du guide d'utilisation.
// La page du guide reste statique (ISR) : l'état de connexion est donc lu
// côté client, via l'endpoint de session d'Auth.js. Si l'utilisateur est déjà
// connecté, le bouton devient un lien vers son tableau de bord.
export default function GuideAuthButton({
  className,
  children,
  dashboardLabel = "Mon tableau de bord",
  icon = null,
}) {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/auth/session", {
      cache: "no-store",
      credentials: "same-origin",
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((session) => setAuthenticated(Boolean(session?.user)))
      .catch(() => {
        // Échec réseau ou requête annulée : on garde le bouton « Se connecter ».
      });

    return () => controller.abort();
  }, []);

  if (authenticated) {
    return (
      <Link href="/dashboard" className={className}>
        {dashboardLabel}
        {icon}
      </Link>
    );
  }

  return (
    <AuthButton mode="login" className={className}>
      {children}
    </AuthButton>
  );
}
