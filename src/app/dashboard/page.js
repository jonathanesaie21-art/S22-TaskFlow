import { redirect } from "next/navigation";
import { auth } from "@/auth";
import DashboardApp from "@/components/dashboard/dashboard-app";
import { getUserTasks } from "@/services/task.service";

export const metadata = {
  title: "Tableau de bord — TaskFlow",
};

// Rendu serveur à chaque requête : les tâches dépendent de la session.
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  // Le proxy protège déjà /dashboard ; cette vérification protège aussi la lecture des données.
  if (!session?.user?.id) {
    redirect("/?auth=login&callbackUrl=%2Fdashboard");
  }

  const tasks = await getUserTasks(session.user.id);
  const user = {
    name: session.user.name ?? session.user.email ?? "Utilisateur",
    email: session.user.email ?? "",
  };

  return <DashboardApp user={user} initialTasks={tasks} />;
}