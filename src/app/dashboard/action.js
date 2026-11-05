"use server";

// Permet de demander à Next.js de recharger les données de cette route.
import { revalidatePath } from "next/cache";

// Récupère la session Auth.js côté serveur.
import { auth } from "@/auth";

// Pool de connexion à PostgreSQL.
import pool from "@/lib/db";

// Liste blanche des statuts acceptés par l'application.
const ALLOWED_STATUSES = ["TODO", "IN_PROGRESS", "DONE"];

// Action serveur appelée pour changer le statut d'une tâche.
export async function updateTaskStatus(taskId, status) {
  // Vérifie l'identité côté serveur pour ne pas faire confiance au navigateur.
  const session = await auth();
  const userId = session?.user?.id;

  // Refuse l'opération si aucune session utilisateur n'existe.
  if (!userId) {
    return { success: false, error: "Vous devez être connecté." };
  }

  // Vérifie les valeurs reçues avant de les utiliser.
  if (typeof taskId !== "string" || !ALLOWED_STATUSES.includes(status)) {
    return { success: false, error: "Les données fournies sont invalides." };
  }

  try {
    // Met à jour la tâche seulement si elle appartient à l'utilisateur connecté.
    const result = await pool.query(
      `
        UPDATE tasks
        SET status = $1, updated_at = NOW()
        WHERE id = $2 AND user_id = $3
        RETURNING id
      `,
      [status, taskId, userId] // Valeurs paramétrées pour éviter l'injection SQL.
    );

    // Aucune ligne modifiée signifie que la tâche n'existe pas
    // ou qu'elle appartient à un autre utilisateur.
    if (result.rowCount === 0) {
      return {
        success: false,
        error: "Tâche introuvable ou accès non autorisé.",
      };
    }

    // Invalide les données de la page pour que les statistiques soient recalculées.
    revalidatePath("/dashboard");

    // Informe le composant client que la modification a réussi.
    return { success: true };
  } catch (error) {
    // L'erreur détaillée reste côté serveur, sans exposer de détails internes à l'utilisateur.
    console.error("Erreur lors de la mise à jour du statut :", error);

    // Retourne un message compréhensible à l'interface.
    return {
      success: false,
      error: "Impossible de mettre à jour la tâche. Réessayez.",
    };
  }
}