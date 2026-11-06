"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import dynamic from "next/dynamic";

const AuthModal = dynamic(() => import("./auth-modal"));
const LoginForm = dynamic(() => import("./login-form"));
const RegisterForm = dynamic(() => import("./register-form"));

const AuthContext = createContext(null);

// Gère les modals de connexion / inscription pour toute la page.
// Lit ?auth=login|register&callbackUrl=... (posé par le proxy) dans useEffect
// afin que l'accueil reste entièrement statique (SSG).
export function AuthProvider({ children }) {
  const [mode, setMode] = useState(null); // null | "login" | "register"
  const [callbackUrl, setCallbackUrl] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("auth");

    if (requested === "login" || requested === "register") {
      // Lecture de l'URL au montage : le composant est rendu statiquement,
      // l'état ne peut donc être posé qu'ici, côté client.
      /* eslint-disable react-hooks/set-state-in-effect -- lecture de l'URL côté client uniquement (page statique) */
      setCallbackUrl(params.get("callbackUrl"));
      setMode(requested);
      /* eslint-enable react-hooks/set-state-in-effect */
    }
  }, []);

  const open = useCallback((nextMode) => setMode(nextMode), []);

  const close = useCallback(() => {
    setMode(null);

    // Nettoie l'URL (?auth=...&callbackUrl=...) sans recharger la page.
    const params = new URLSearchParams(window.location.search);
    if (params.has("auth") || params.has("callbackUrl")) {
      params.delete("auth");
      params.delete("callbackUrl");
      const query = params.toString();
      window.history.replaceState(
        null,
        "",
        window.location.pathname + (query ? `?${query}` : ""),
      );
    }
  }, []);

  const value = useMemo(() => ({ mode, open, close }), [mode, open, close]);

  return (
    <AuthContext.Provider value={value}>
      {children}
      {mode && (
        <AuthModal
          title={mode === "login" ? "Se connecter" : "Créer un compte"}
          onClose={close}
        >
          {mode === "login" ? (
            <LoginForm
              callbackUrl={callbackUrl}
              onSwitch={() => setMode("register")}
            />
          ) : (
            <RegisterForm onSwitch={() => setMode("login")} />
          )}
        </AuthModal>
      )}
    </AuthContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthModal doit être utilisé dans <AuthProvider>.");
  }
  return context;
}

// Bouton qui ouvre le modal. mode = "login" | "register"
export function AuthButton({ mode, className, children }) {
  const { open } = useAuthModal();
  return (
    <button type="button" className={className} onClick={() => open(mode)}>
      {children}
    </button>
  );
}
