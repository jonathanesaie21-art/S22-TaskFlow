"use client";
import SignOutButton from "@/components/auth/sign-out-button";

// useMemo évite de recalculer les résultats à chaque rendu si les données n'ont pas changé.
// useState mémorise la recherche et le message d'erreur.
// useTransition indique qu'une mise à jour serveur est en cours.
import { useMemo, useState, useTransition } from "react";

// Permet de rafraîchir les données serveur après une modification.
import { useRouter } from "next/navigation";

// Action serveur qui met à jour le statut dans PostgreSQL.
import { updateTaskStatus } from "./actions";

// Traduction des statuts stockés en base vers des libellés lisibles.
const STATUS_LABELS = {
  TODO: "À faire",
  IN_PROGRESS: "En cours",
  DONE: "Terminé",
};

// Carte réutilisable pour afficher une statistique.
function StatCard({ label, value }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-sm font-medium text-slate-600">{label}</h2>
      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
    </article>
  );
}

// Composant client du dashboard ; reçoit les tâches chargées côté serveur.
export default function DashboardClient({ tasks }) {
  // Texte saisi dans le champ de recherche.
  const [search, setSearch] = useState("");

  // Message d'erreur affiché si la mise à jour échoue.
  const [error, setError] = useState("");

  // isPending permet de désactiver les contrôles pendant l'action serveur.
  const [isPending, startTransition] = useTransition();

  // Permet de demander un nouveau rendu serveur après une modification.
  const router = useRouter();

  // Calcule les statistiques à partir des tâches de l'utilisateur reçues du serveur.
  const stats = useMemo(
    () => ({
      total: tasks.length,
      todo: tasks.filter((task) => task.status === "TODO").length,
      inProgress: tasks.filter((task) => task.status === "IN_PROGRESS").length,
      done: tasks.filter((task) => task.status === "DONE").length,
    }),
    [tasks], // Recalcule les compteurs lorsque la liste des tâches change.
  );

  // Filtre les tâches dont le titre contient la recherche.
  const filteredTasks = useMemo(() => {
    // Ignore les espaces au début et à la fin, puis rend la recherche insensible à la casse.
    const query = search.trim().toLocaleLowerCase();

    // Si la recherche est vide, affiche toutes les tâches.
    if (!query) return tasks;

    // Ne conserve que les tâches dont le titre contient la recherche.
    return tasks.filter((task) =>
      task.title.toLocaleLowerCase().includes(query),
    );
  }, [tasks, search]); // Refiltre lorsque la recherche ou les tâches changent.

  // Lance la mise à jour du statut sur le serveur.
  function handleStatusChange(taskId, status) {
    // Efface un éventuel message d'erreur précédent.
    setError("");

    // Marque l'opération comme transition afin de gérer l'état de chargement.
    startTransition(async () => {
      // Appelle l'action serveur ; elle vérifie la session et la propriété de la tâche.
      const result = await updateTaskStatus(taskId, status);

      // Affiche l'erreur retournée par le serveur si l'opération a échoué.
      if (!result.success) {
        setError(result.error);
        return;
      }

      // Recharge les données serveur : tâche et statistiques sont mises à jour.
      router.refresh();
    });
  }

  return (
    <main className="mx-auto max-w-6xl space-y-8 p-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="mt-2 text-slate-600">
            Retrouvez vos tâches et leur avancement.
          </p>
        </div>
        <SignOutButton />
      </header>

      {/* Statistiques calculées sur les tâches de l'utilisateur connecté. */}
      <section
        aria-label="Statistiques des tâches"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <StatCard label="Total des tâches" value={stats.total} />
        <StatCard label="À faire" value={stats.todo} />
        <StatCard label="En cours" value={stats.inProgress} />
        <StatCard label="Terminées" value={stats.done} />
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Mes tâches</h2>

          {/* Champ de recherche par titre. */}
          <label className="sm:w-80">
            <span className="sr-only">Rechercher une tâche par titre</span>
            <input
              type="search"
              value={search}
              // Met à jour la recherche à chaque saisie.
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher par titre…"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </label>
        </div>

        {/* Présente l'erreur de mise à jour aux technologies d'assistance aussi. */}
        {error && (
          <p role="alert" className="mb-4 text-sm text-red-700">
            {error}
          </p>
        )}

        {/* Affiche un état vide différent selon qu'il existe des tâches ou non. */}
        {filteredTasks.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500">
            {tasks.length === 0
              ? "Vous n’avez pas encore de tâches."
              : "Aucune tâche ne correspond à cette recherche."}
          </p>
        ) : (
          <ul className="divide-y divide-slate-200">
            {filteredTasks.map((task) => (
              <li
                key={task.id}
                className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h3 className="font-medium text-slate-900">{task.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Priorité : {task.priority}
                    {task.dueDate ? ` · Échéance : ${task.dueDate}` : ""}
                  </p>
                </div>

                {/* Permet de modifier le statut ; désactivé pendant la requête. */}
                <label className="text-sm text-slate-700">
                  <span className="sr-only">Statut de {task.title}</span>
                  <select
                    value={task.status}
                    disabled={isPending}
                    onChange={(event) =>
                      handleStatusChange(task.id, event.target.value)
                    }
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 disabled:opacity-60"
                  >
                    {/* Génère une option par statut autorisé. */}
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
