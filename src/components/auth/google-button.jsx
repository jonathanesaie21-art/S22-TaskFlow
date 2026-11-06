"use client";

import { signIn } from "next-auth/react";

export default function GoogleButton({ callbackUrl = "/dashboard" }) {
  return (
    <>
      <button
        type="button"
        className="auth-google"
        onClick={() => signIn("google", { callbackUrl })}
      >
        Continuer avec Google
      </button>
      <p className="auth-divider">ou</p>
    </>
  );
}
