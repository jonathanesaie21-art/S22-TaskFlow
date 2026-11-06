"use client";

import {
  PAGE_SIZE,
  PRIORITY_META,
  STATUS_META,
  TASK_PRIORITIES,
  TASK_STATUSES,
} from "@/lib/task-constants";
import Icon from "./dashboard-icons";
import { PriorityBadge, StatusBadge, StatusCheck, formatDueDate } from "./task-badges";

// Numéros de pages : toutes si peu nombreuses, sinon première, dernière et voisines.
function pageItems(page, pageCount) {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1);
  const items = new Set([1, pageCount, page - 1, page, page + 1]);
  const sorted = [...items].filter((n) => n >= 1 && n <= pageCount).sort((a, b) => a - b);
  const result = [];
  sorted.forEach((n, index) => {
    if (index > 0 && n - sorted[index - 1] > 1) result.push("gap");
    result.push(n);
  });
  return result;
}

export default function TasksView({
  visible,
  filteredCount,
  total,
  search,
  onSearch,
  statusFilter,
  onStatusFilter,
  priorityFilter,
  onPriorityFilter,
  page,
  pageCount,
  onPage,
  onNewTask,
  onEdit,
  onDelete,
  onCycle,
  onClearFilters,
}) {
  const start = filteredCount === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, filteredCount);

  return (
    <>
      <div className="tf-page-head">
        <div>
          <p className="tf-eyebrow">Espace de travail</p>
          <h1 className="tf-title">Mes tâches</h1>
          <p className="tf-subtitle">Organisez, priorisez et suivez votre travail.</p>
        </div>
        <button type="button" className="tf-primary-button" onClick={onNewTask}>
          <Icon name="plus" size={18} />
          Nouvelle tâche
        </button>
      </div>

      <section className="tf-toolbar" aria-label="Recherche et filtres">
        <div className="tf-search tf-search-local">
          <Icon name="search" size={18} />
          <input
            type="search"
            value={search}
            placeholder="Rechercher par nom..."
            aria-label="Rechercher une tâche par nom"
            onChange={(event) => onSearch(event.target.value)}
          />
        </div>

        <span className="tf-toolbar-label">
          <Icon name="filter" size={18} />
          Filtres
        </span>

        <label className="tf-select">
          <span>Statut</span>
          <select value={statusFilter} onChange={(event) => onStatusFilter(event.target.value)}>
            <option value="all">Tous les statuts</option>
            {TASK_STATUSES.map((status) => (
              <option key={status} value={status}>
                {STATUS_META[status].label}
              </option>
            ))}
          </select>
        </label>

        <label className="tf-select">
          <span>Priorité</span>
          <select value={priorityFilter} onChange={(event) => onPriorityFilter(event.target.value)}>
            <option value="all">Toutes les priorités</option>
            {[...TASK_PRIORITIES].reverse().map((priority) => (
              <option key={priority} value={priority}>
                {PRIORITY_META[priority].label}
              </option>
            ))}
          </select>
        </label>

        <p className="tf-result-count" aria-live="polite">
          {filteredCount} sur {total} tâches
        </p>
      </section>

      <section className="tf-card tf-table-card" aria-label="Liste des tâches">
        {filteredCount === 0 ? (
          <div className="tf-empty">
            <span className="tf-empty-icon">
              <Icon name="search" size={26} />
            </span>
            <h2>Aucune tâche trouvée</h2>
            <p>Modifiez la recherche ou les filtres pour afficher d’autres tâches.</p>
            <button type="button" className="tf-secondary-button" onClick={onClearFilters}>
              Effacer les filtres
            </button>
          </div>
        ) : (
          <>
            <div className="tf-table-head" aria-hidden="true">
              <span />
              <span>Tâche</span>
              <span>Statut</span>
              <span>Priorité</span>
              <span className="tf-col-due">Échéance</span>
              <span />
            </div>
            <ul className="tf-table-body">
              {visible.map((task) => (
                <li className="tf-row" key={task.id}>
                  <StatusCheck task={task} onCycle={onCycle} />
                  <div className="tf-row-title">
                    <button
                      type="button"
                      className={`tf-task-title ${task.status === "Terminé" ? "is-done" : ""}`}
                      onClick={() => onEdit(task)}
                    >
                      {task.title}
                    </button>
                    {task.category && <small>{task.category}</small>}
                  </div>
                  <div className="tf-row-status">
                    <StatusBadge status={task.status} />
                  </div>
                  <div className="tf-row-priority">
                    <PriorityBadge priority={task.priority} />
                  </div>
                  <span className="tf-due tf-col-due">
                    <Icon name="calendar" size={15} />
                    {formatDueDate(task.dueDate)}
                  </span>
                  <div className="tf-row-actions">
                    <button
                      type="button"
                      className="tf-icon-button"
                      aria-label={`Modifier « ${task.title} »`}
                      onClick={() => onEdit(task)}
                    >
                      <Icon name="pencil" size={18} />
                    </button>
                    <button
                      type="button"
                      className="tf-icon-button tf-danger"
                      aria-label={`Supprimer « ${task.title} »`}
                      onClick={() => onDelete(task)}
                    >
                      <Icon name="trash" size={18} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="tf-pagination">
              <p>
                Affichage de <strong>{start}</strong> à <strong>{end}</strong> sur{" "}
                <strong>{filteredCount}</strong>
              </p>
              <nav aria-label="Pagination">
                <button
                  type="button"
                  className="tf-page-button"
                  aria-label="Page précédente"
                  disabled={page <= 1}
                  onClick={() => onPage(page - 1)}
                >
                  <Icon name="left" size={16} />
                </button>
                {pageItems(page, pageCount).map((item, index) =>
                  item === "gap" ? (
                    <span className="tf-page-gap" key={`gap-${index}`} aria-hidden="true">
                      …
                    </span>
                  ) : (
                    <button
                      type="button"
                      key={item}
                      className={`tf-page-button ${item === page ? "is-active" : ""}`}
                      aria-label={`Page ${item}`}
                      aria-current={item === page ? "page" : undefined}
                      onClick={() => onPage(item)}
                    >
                      {item}
                    </button>
                  ),
                )}
                <button
                  type="button"
                  className="tf-page-button"
                  aria-label="Page suivante"
                  disabled={page >= pageCount}
                  onClick={() => onPage(page + 1)}
                >
                  <Icon name="arrow" size={16} />
                </button>
              </nav>
            </footer>
          </>
        )}
      </section>
    </>
  );
}
