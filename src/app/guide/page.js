import Link from "next/link";
import { AuthButton, AuthProvider } from "@/components/auth/auth-provider";
import TaskflowBrand from "@/components/ui/taskflow-brand";
import "@/components/guide/guide.css";

export const metadata = {
  title: "Guide d’utilisation",
  description:
    "Prenez TaskFlow en main : créer, organiser et suivre vos tâches étape par étape.",
  alternates: { canonical: "/guide" },
};

// Page statique régénérée toutes les heures (ISR) : son contenu ne dépend pas de l'utilisateur.
export const revalidate = 3600;

const STEPS = [
  {
    number: "01",
    icon: "plus",
    title: "Créez votre première tâche",
    text: "Depuis « Mes tâches », cliquez sur Nouvelle tâche puis renseignez son titre, sa priorité et son échéance.",
  },
  {
    number: "02",
    icon: "filter",
    title: "Organisez votre travail",
    text: "Utilisez la recherche et les filtres pour retrouver rapidement une tâche selon son statut ou sa priorité.",
  },
  {
    number: "03",
    icon: "check",
    title: "Suivez votre progression",
    text: "Faites évoluer le statut de vos tâches et consultez les indicateurs depuis la vue d’ensemble.",
  },
];

const BASICS = [
  {
    icon: "grid",
    title: "Vue d’ensemble",
    text: "Consultez le nombre total de tâches et leur répartition entre À faire, En cours et Terminées.",
  },
  {
    icon: "search",
    title: "Recherche et filtres",
    text: "Recherchez une tâche par son nom puis combinez les filtres de statut et de priorité pour affiner la liste.",
  },
  {
    icon: "gear",
    title: "Modification et suppression",
    text: "Cliquez sur une tâche pour la modifier. Toute suppression demande une confirmation avant d’être appliquée.",
  },
];

function GuideIcon({ name }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };
  switch (name) {
    case "plus":
      return (
        <svg {...common}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );
    case "filter":
      return (
        <svg {...common}>
          <path d="M4 7h16M7 12h10M10 17h4" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="m8.5 12.3 2.5 2.5 4.6-5" />
        </svg>
      );
    case "grid":
      return (
        <svg {...common}>
          <rect x="3.5" y="3.5" width="7" height="7" rx="2" />
          <rect x="13.5" y="3.5" width="7" height="7" rx="2" />
          <rect x="3.5" y="13.5" width="7" height="7" rx="2" />
          <rect x="13.5" y="13.5" width="7" height="7" rx="2" />
        </svg>
      );
    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4 4" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 3.5v2M12 18.5v2M3.5 12h2M18.5 12h2M6 6l1.4 1.4M16.6 16.6 18 18M18 6l-1.4 1.4M7.4 16.6 6 18" />
        </svg>
      );
  }
}

export default function GuidePage() {
  return (
    <AuthProvider>
      <div className="guide-page">
        <header className="guide-header">
          <TaskflowBrand href="/" />
          <nav className="guide-nav" aria-label="Navigation du guide">
            <Link href="/" className="guide-nav-link">
              Accueil
            </Link>
            <AuthButton mode="login" className="guide-button">
              Se connecter
            </AuthButton>
          </nav>
        </header>

        <main>
          <section className="guide-hero">
            <p className="guide-badge">
              <span aria-hidden="true" />
              Guide d’utilisation
            </p>
            <h1>
              Prenez TaskFlow en main,
              <br />
              <em>étape par étape.</em>
            </h1>
            <p className="guide-lead">
              Retrouvez les actions essentielles pour organiser vos tâches,
              suivre vos priorités et avancer plus sereinement.
            </p>
          </section>

          <section className="guide-steps" aria-label="Les trois étapes">
            {STEPS.map((step) => (
              <article className="guide-step" key={step.number}>
                <span className="guide-step-number" aria-hidden="true">
                  {step.number}
                </span>
                <span className="guide-step-icon">
                  <GuideIcon name={step.icon} />
                </span>
                <h2>{step.title}</h2>
                <p>{step.text}</p>
              </article>
            ))}
          </section>

          <section className="guide-dark" aria-labelledby="guide-basics">
            <div>
              <p className="guide-dark-label">Les fondamentaux</p>
              <h2 id="guide-basics">
                Tout ce qu’il faut savoir pour bien démarrer
              </h2>
            </div>
            <ul>
              {BASICS.map((item) => (
                <li key={item.title}>
                  <span className="guide-dark-icon">
                    <GuideIcon name={item.icon} />
                  </span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="guide-cta">
            <div>
              <h2>Prêt à organiser vos journées ?</h2>
              <p>Connectez-vous et commencez à gérer vos tâches.</p>
            </div>
            <AuthButton mode="login" className="guide-button">
              Se connecter
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m9.5 6 6 6-6 6" />
              </svg>
            </AuthButton>
          </section>
        </main>
      </div>
    </AuthProvider>
  );
}
