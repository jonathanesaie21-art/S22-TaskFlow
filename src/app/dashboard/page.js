// redirect permet de renvoyer les utilisateurs non authentifiés vers l'accueil.
import { redirect } from "next/navigation";

// Récupère la session Auth.js côté serveur.
import { auth } from "@/auth";

// Fonction de lecture des tâches depuis PostgreSQL.
import { getUserTasks } from "@/services/task.service";

// Composant client pour la recherche et les interactions du dashboard.
import DashboardClient from "./dashboard-client";

// Indique à Next.js que cette page dépend de données dynamiques et privées.
export const dynamic = "force-dynamic";

// Cette page est un composant serveur, car elle lit la session et la base de données.
export default async function DashboardPage() {
  // Récupère la session de l'utilisateur courant.
  const session = await auth();

  // L'ID doit provenir de la session vérifiée, pas d'une valeur envoyée par le navigateur.
  const userId = session?.user?.id;

  // Empêche l'accès au dashboard sans utilisateur authentifié.
  if (!userId) {
    redirect("/");
  }

  // Charge uniquement les tâches liées à l'utilisateur connecté.
  const tasks = await getUserTasks(userId);

  // Transmet les tâches au composant client pour affichage et recherche.
  return <DashboardClient tasks={tasks} />;
}