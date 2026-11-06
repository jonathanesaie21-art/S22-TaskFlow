import Link from "next/link";
import { AuthButton, AuthProvider } from "@/components/auth/auth-provider";
import LandingEffects from "@/components/landing/landing-effects";
import Logo from "@/components/ui/logo";
import "./landing.css";

// Page d'accueil : SSG. Ne lire ici ni cookies, ni headers, ni session.
export const dynamic = "force-static";

const wordStyle = (index) => ({ "--word-index": index });

export default function HomePage() {
  return (
    <AuthProvider>
      <div className="landing">
        <header className="landing-header">
          <Logo />
          <nav
            className="landing-nav"
            aria-label="Navigation de la page d’accueil"
          >
            <Link href="/guide">Guide d’utilisation</Link>
          </nav>
          <AuthButton mode="login" className="landing-login">
            Se connecter
          </AuthButton>
        </header>

        <main className="landing-hero">
          <div className="landing-hero-copy">
            <div className="landing-pill">
              <span />
              Votre quotidien, enfin organisé
            </div>

            <h1 aria-label="Moins de chaos. Plus de progrès.">
              <span className="landing-line" aria-hidden="true">
                <span style={wordStyle(0)}>Moins</span>{" "}
                <span style={wordStyle(1)}>de</span>{" "}
                <span style={wordStyle(2)}>chaos.</span>
              </span>
              <span className="landing-line" aria-hidden="true">
                <span style={wordStyle(3)}>Plus</span>{" "}
                <span style={wordStyle(4)}>de</span>{" "}
                <em style={wordStyle(5)}>progrès.</em>
              </span>
            </h1>

            <p>
              TaskFlow vous aide à centraliser vos tâches, suivre vos priorités
              et avancer sereinement vers vos objectifs — le tout dans un espace
              simple et clair.
            </p>

            <div className="landing-actions">
              <AuthButton mode="register" className="landing-btn-primary">
                Commencer gratuitement
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </AuthButton>
              <Link href="/guide" className="landing-btn-ghost">
                <span aria-hidden="true">
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </span>
                Découvrir la plateforme
              </Link>
            </div>
          </div>
        </main>

        <LandingEffects />
      </div>
    </AuthProvider>
  );
}
