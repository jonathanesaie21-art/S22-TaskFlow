"use client";

import TaskflowBrand from "@/components/ui/taskflow-brand";
import Icon from "./dashboard-icons";
import { initialsOf } from "./dashboard-sidebar";

// La recherche globale partage son état avec la recherche locale de "Mes tâches".
export default function DashboardTopbar({ user, search, onSearch, onSearchFocus }) {
  return (
    <header className="tf-topbar">
      <div className="tf-topbar-brand">
        <TaskflowBrand href="/dashboard" />
      </div>

      <div className="tf-search tf-search-global">
        <Icon name="search" size={18} />
        <input
          type="search"
          value={search}
          placeholder="Rechercher une tâche…"
          aria-label="Rechercher une tâche"
          onChange={(event) => onSearch(event.target.value)}
          onFocus={onSearchFocus}
        />
        <kbd aria-hidden="true">⌘ K</kbd>
      </div>

      <div className="tf-topbar-actions">
        <button type="button" className="tf-icon-button tf-bell" aria-label="Notifications">
          <Icon name="bell" />
          <span className="tf-notif-dot" aria-hidden="true" />
        </button>
        <button type="button" className="tf-icon-button" aria-label="Paramètres">
          <Icon name="settings" />
        </button>
        <span className="tf-avatar tf-avatar-mobile" aria-hidden="true">
          {initialsOf(user.name)}
        </span>
      </div>
    </header>
  );
}
