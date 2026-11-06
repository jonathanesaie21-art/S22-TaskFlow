"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import TaskflowBrand from "@/components/ui/taskflow-brand";
import Icon from "./dashboard-icons";

export function initialsOf(name) {
  const parts = String(name ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

export default function DashboardSidebar({ user, view, onNavigate, taskCount }) {
  return (
    <aside className="tf-sidebar" aria-label="Navigation principale">
      <div className="tf-sidebar-head">
        <TaskflowBrand href="/dashboard" />
      </div>

      <nav className="tf-sidebar-nav">
        <p className="tf-nav-label">Espace de travail</p>
        <button
          type="button"
          className="tf-nav-item"
          aria-current={view === "overview" ? "page" : undefined}
          onClick={() => onNavigate("overview")}
        >
          <Icon name="grid" />
          <span>Vue d’ensemble</span>
        </button>
        <button
          type="button"
          className="tf-nav-item"
          aria-current={view === "tasks" ? "page" : undefined}
          onClick={() => onNavigate("tasks")}
        >
          <Icon name="check" />
          <span>Mes tâches</span>
          <span className="tf-count">{taskCount}</span>
        </button>

        <p className="tf-nav-label tf-nav-label-spaced">Ressources</p>
        <Link href="/guide" className="tf-nav-item">
          <Icon name="help" />
          <span>Guide d’utilisation</span>
        </Link>
      </nav>

      <div className="tf-sidebar-foot">
        <div className="tf-user">
          <span className="tf-avatar" aria-hidden="true">
            {initialsOf(user.name)}
          </span>
          <span className="tf-user-text">
            <strong>{user.name}</strong>
            <small>{user.email}</small>
          </span>
        </div>
        <button
          type="button"
          className="tf-signout"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <Icon name="logout" />
          <span>Se déconnecter</span>
        </button>
      </div>
    </aside>
  );
}
