import { PRIORITY_META, STATUS_META } from "@/lib/task-constants";

export function StatusBadge({ status }) {
  const meta = STATUS_META[status];
  return (
    <span className={`tf-badge tf-status-${meta.key}`}>{meta.label}</span>
  );
}

export function PriorityBadge({ priority }) {
  const meta = PRIORITY_META[priority];
  return (
    <span className={`tf-badge tf-priority-${meta.key}`}>
      <span className="tf-dot" aria-hidden="true" />
      {meta.label}
    </span>
  );
}

// Case de statut : un clic fait passer la tâche au statut suivant.
export function StatusCheck({ task, onCycle }) {
  const key = STATUS_META[task.status].key;
  return (
    <button
      type="button"
      className={`tf-check tf-check-${key}`}
      aria-label={`Changer le statut de « ${task.title} » (actuellement ${STATUS_META[task.status].label})`}
      onClick={() => onCycle(task)}
    >
      {key === "progress" && <span className="tf-check-dot" aria-hidden="true" />}
      {key === "done" && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m6 12.5 4 4 8-9" />
        </svg>
      )}
    </button>
  );
}

// "2026-11-04" -> "04 nov." (lecture en UTC : pas de décalage de fuseau).
export function formatDueDate(dueDate) {
  if (!dueDate) return "Sans échéance";
  const [year, month, day] = dueDate.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
  });
}
