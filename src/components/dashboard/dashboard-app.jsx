"use client";

import { useCallback, useMemo, useState } from "react";
import { PAGE_SIZE, STATUS_META, nextStatus } from "@/lib/task-constants";
import ConfirmDeleteDialog from "./confirm-delete-dialog";
import DashboardOverview from "./dashboard-overview";
import DashboardSidebar from "./dashboard-sidebar";
import DashboardTopbar from "./dashboard-topbar";
import MobileNav from "./mobile-nav";
import TaskModal from "./task-modal";
import TasksView from "./tasks-view";
import Toast from "./toast";
import "./dashboard.css";

// Appel JSON vers /api/tasks. Ne lève jamais : renvoie { ok, task?, fieldErrors?, error? }.
async function request(url, method, body) {
  try {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return {
        ok: false,
        fieldErrors: data.fieldErrors,
        error:
          data.error ??
          (response.status === 401
            ? "Votre session a expiré. Reconnectez-vous."
            : "Une erreur est survenue. Réessayez."),
      };
    }
    return { ok: true, task: data.task };
  } catch {
    return {
      ok: false,
      error: "Impossible de joindre le serveur. Vérifiez votre connexion.",
    };
  }
}

export default function DashboardApp({ user, initialTasks }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [view, setView] = useState("overview");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null); // null | { task: Task | null }
  const [deleting, setDeleting] = useState(null);
  const [toast, setToast] = useState(null);

  const notify = useCallback((message, tone = "success") => {
    setToast({ message, tone, id: Date.now() });
  }, []);
  const dismissToast = useCallback(() => setToast(null), []);

  const stats = useMemo(
    () => ({
      total: tasks.length,
      todo: tasks.filter((task) => task.status === "À faire").length,
      progress: tasks.filter((task) => task.status === "En cours").length,
      done: tasks.filter((task) => task.status === "Terminé").length,
    }),
    [tasks],
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(query) &&
        (statusFilter === "all" || task.status === statusFilter) &&
        (priorityFilter === "all" || task.priority === priorityFilter),
    );
  }, [tasks, search, statusFilter, priorityFilter]);

  // La page courante est recalculée à chaque rendu : après une suppression
  // ou un filtre, elle ne dépasse jamais le nombre de pages.
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function changeSearch(value) {
    setSearch(value);
    setPage(1);
  }
  function changeStatusFilter(value) {
    setStatusFilter(value);
    setPage(1);
  }
  function changePriorityFilter(value) {
    setPriorityFilter(value);
    setPage(1);
  }
  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setPage(1);
  }

  async function saveTask(values) {
    const editing = modal?.task ?? null;
    const result = await request(
      editing ? `/api/tasks/${editing.id}` : "/api/tasks",
      editing ? "PATCH" : "POST",
      values,
    );
    if (!result.ok) return result;

    setTasks((current) =>
      editing
        ? current.map((task) => (task.id === editing.id ? result.task : task))
        : [result.task, ...current],
    );
    if (!editing) setPage(1);
    setModal(null);
    notify(editing ? "Les modifications ont été enregistrées." : "La tâche a bien été créée.");
    return null;
  }

  async function cycleStatus(task) {
    const status = nextStatus(task.status);
    const result = await request(`/api/tasks/${task.id}`, "PATCH", { status });
    if (!result.ok) {
      notify(result.error, "error");
      return;
    }
    setTasks((current) => current.map((item) => (item.id === task.id ? result.task : item)));
    notify(`Tâche passée en « ${STATUS_META[status].label} ».`);
  }

  async function confirmDelete() {
    const result = await request(`/api/tasks/${deleting.id}`, "DELETE");
    if (!result.ok) return result;

    setTasks((current) => current.filter((task) => task.id !== deleting.id));
    setDeleting(null);
    notify("La tâche a été supprimée.");
    return null;
  }

  const firstName = user.name.trim().split(/\s+/)[0] || user.name;

  return (
    <div className="tf-app">
      <DashboardSidebar
        user={user}
        view={view}
        onNavigate={setView}
        taskCount={stats.total}
      />

      <div className="tf-main">
        <DashboardTopbar
          user={user}
          search={search}
          onSearch={changeSearch}
          onSearchFocus={() => setView("tasks")}
        />

        <main className="tf-content">
          {view === "overview" ? (
            <DashboardOverview
              firstName={firstName}
              tasks={tasks}
              stats={stats}
              onNewTask={() => setModal({ task: null })}
              onOpenTasks={() => setView("tasks")}
              onEdit={(task) => setModal({ task })}
              onCycle={cycleStatus}
            />
          ) : (
            <TasksView
              visible={visible}
              filteredCount={filtered.length}
              total={tasks.length}
              search={search}
              onSearch={changeSearch}
              statusFilter={statusFilter}
              onStatusFilter={changeStatusFilter}
              priorityFilter={priorityFilter}
              onPriorityFilter={changePriorityFilter}
              page={currentPage}
              pageCount={pageCount}
              onPage={setPage}
              onNewTask={() => setModal({ task: null })}
              onEdit={(task) => setModal({ task })}
              onDelete={setDeleting}
              onCycle={cycleStatus}
              onClearFilters={clearFilters}
            />
          )}
        </main>
      </div>

      <MobileNav view={view} onNavigate={setView} taskCount={stats.total} />

      {modal && (
        <TaskModal
          key={modal.task?.id ?? "new"}
          task={modal.task}
          onClose={() => setModal(null)}
          onSubmit={saveTask}
        />
      )}
      {deleting && (
        <ConfirmDeleteDialog
          key={deleting.id}
          task={deleting}
          onClose={() => setDeleting(null)}
          onConfirm={confirmDelete}
        />
      )}

      <Toast toast={toast} onDone={dismissToast} />
    </div>
  );
}
