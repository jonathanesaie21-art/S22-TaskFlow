"use client";

import Icon from "./dashboard-icons";
import { PriorityBadge, StatusBadge, StatusCheck, formatDueDate } from "./task-badges";

const two = (value) => String(value).padStart(2, "0");

export default function DashboardOverview({
  firstName,
  tasks,
  stats,
  onNewTask,
  onOpenTasks,
  onEdit,
  onCycle,
}) {
  const completion = stats.total ? Math.round((stats.done / stats.total) * 100) : 0;
  const recent = tasks.slice(0, 4);

  const cards = [
    { key: "total", icon: "grid", label: "Toutes les tâches", value: stats.total, hint: "Tous statuts confondus" },
    { key: "todo", icon: "calendar", label: "À faire", value: stats.todo, hint: "À planifier" },
    { key: "progress", icon: "arrow", label: "En cours", value: stats.progress, hint: "À poursuivre" },
    { key: "done", icon: "check", label: "Terminées", value: stats.done, hint: `${completion}% complété` },
  ];

  const legend = [
    { key: "done", label: "Terminée", value: stats.done },
    { key: "progress", label: "En cours", value: stats.progress },
    { key: "todo", label: "À faire", value: stats.todo },
  ];

  return (
    <>
      <div className="tf-page-head">
        <div>
          <p className="tf-eyebrow" suppressHydrationWarning>
            {new Intl.DateTimeFormat("fr-FR", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            }).format(new Date())}
          </p>
          <h1 className="tf-title">Bonjour {firstName},</h1>
          <p className="tf-subtitle">Voici où en est votre travail aujourd’hui.</p>
        </div>
        <button type="button" className="tf-primary-button" onClick={onNewTask}>
          <Icon name="plus" size={18} />
          Nouvelle tâche
        </button>
      </div>

      <section className="tf-stats" aria-label="Statistiques">
        {cards.map((card) => (
          <article className={`tf-stat tf-stat-${card.key}`} key={card.key}>
            <span className="tf-stat-icon">
              <Icon name={card.icon} />
            </span>
            <div className="tf-stat-body">
              <p>{card.label}</p>
              <strong>{two(card.value)}</strong>
            </div>
            <small>{card.hint}</small>
          </article>
        ))}
      </section>

      <div className="tf-panels">
        <section className="tf-card" aria-labelledby="recent-title">
          <header className="tf-card-head">
            <div>
              <h2 id="recent-title">Tâches récentes</h2>
              <p>Vos dernières tâches à suivre</p>
            </div>
            <button type="button" className="tf-link-button" onClick={onOpenTasks}>
              Voir toutes
              <Icon name="arrow" size={16} />
            </button>
          </header>

          {recent.length === 0 ? (
            <p className="tf-card-empty">
              Aucune tâche pour le moment. Créez votre première tâche pour commencer.
            </p>
          ) : (
            <ul className="tf-recent-list">
              {recent.map((task) => (
                <li className="tf-recent-row" key={task.id}>
                  <StatusCheck task={task} onCycle={onCycle} />
                  <div className="tf-recent-main">
                    <button
                      type="button"
                      className={`tf-task-title ${task.status === "Terminé" ? "is-done" : ""}`}
                      onClick={() => onEdit(task)}
                    >
                      {task.title}
                    </button>
                    <p className="tf-recent-meta">
                      <PriorityBadge priority={task.priority} />
                      <span className="tf-due">
                        <Icon name="calendar" size={14} />
                        {formatDueDate(task.dueDate)}
                      </span>
                    </p>
                  </div>
                  <StatusBadge status={task.status} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="tf-card" aria-labelledby="progress-title">
          <header className="tf-card-head">
            <div>
              <h2 id="progress-title">Progression globale</h2>
              <p>Répartition de vos tâches</p>
            </div>
          </header>

          <div className="tf-progress">
            <div className="tf-donut" style={{ "--completion": `${completion}%` }} role="img" aria-label={`${completion}% des tâches sont terminées`}>
              <div className="tf-donut-center">
                <strong>{completion}%</strong>
                <span>complété</span>
              </div>
            </div>
            <ul className="tf-legend">
              {legend.map((item) => (
                <li key={item.key}>
                  <span className={`tf-legend-dot tf-legend-${item.key}`} aria-hidden="true" />
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </li>
              ))}
            </ul>
          </div>

          <div className="tf-encourage">
            <Icon name="check" size={20} />
            <p>
              <strong>Beau travail !</strong>
              <span>Continuez sur cette lancée.</span>
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
