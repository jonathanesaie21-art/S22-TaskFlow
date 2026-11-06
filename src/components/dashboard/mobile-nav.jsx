"use client";

import Link from "next/link";
import Icon from "./dashboard-icons";

// Navigation fixe en bas sous 760 px : remplace la sidebar (ni burger, ni menu latéral).
export default function MobileNav({ view, onNavigate, taskCount }) {
  return (
    <nav className="tf-bottom-nav" aria-label="Navigation mobile">
      <button
        type="button"
        className="tf-bottom-item"
        aria-current={view === "overview" ? "page" : undefined}
        onClick={() => onNavigate("overview")}
      >
        <Icon name="grid" />
        <span>Vue d’ensemble</span>
      </button>
      <button
        type="button"
        className="tf-bottom-item"
        aria-current={view === "tasks" ? "page" : undefined}
        onClick={() => onNavigate("tasks")}
      >
        <span className="tf-bottom-icon">
          <Icon name="check" />
          <span className="tf-bottom-count">{taskCount}</span>
        </span>
        <span>Mes tâches</span>
      </button>
      <Link href="/guide" className="tf-bottom-item">
        <Icon name="help" />
        <span>Guide</span>
      </Link>
    </nav>
  );
}
