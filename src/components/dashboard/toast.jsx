"use client";

import { useEffect } from "react";
import Icon from "./dashboard-icons";

// Notification éphémère : bas droite sur ordinateur, au-dessus de la navigation sur mobile.
export default function Toast({ toast, onDone }) {
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(onDone, 3800);
    return () => clearTimeout(timer);
  }, [toast, onDone]);

  return (
    <div className="tf-toast-zone" role="status" aria-live="polite">
      {toast && (
        <div className={`tf-toast ${toast.tone === "error" ? "tf-toast-error" : ""}`}>
          <Icon name={toast.tone === "error" ? "close" : "check"} size={18} />
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
