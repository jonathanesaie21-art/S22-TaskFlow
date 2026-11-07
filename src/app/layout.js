import { DM_Sans, Manrope } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  weight: ["700", "800"],
  variable: "--font-manrope",
});

// URL du site : variable personnalisée si elle existe, sinon l'adresse de
// production fournie par Vercel, sinon localhost en développement.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "TaskFlow — Gestion personnelle des tâches",
    template: "%s | TaskFlow",
  },
  description:
    "TaskFlow, application gratuite de gestion de tâches : centralisez vos priorités et échéances, suivez votre progression et organisez vos journées simplement.",
  keywords: [
    "gestion de tâches",
    "to-do list en ligne",
    "organiser ses tâches",
    "suivi des priorités",
    "application de productivité",
    "TaskFlow",
    "Le top 5 des applications de To-Do list gratuites pour la famille",
    "Comment choisir une application de liste de tâches vraiment simple ?",
    "bullet journal numérique simple",
    "modèle liste de tâches esthétique",
    "planning de la semaine à imprimer gratuit",
    "synchroniser liste de tâches téléphone et ordi",
    "application liste de tâches pc windows",
    "meilleure appli to do list android",
    "application rappel iphone gratuit",
    "comment organiser ses tâches ménagères",
    "application planning familial gratuit",
    "liste de courses partagée couple",
    "application de tâches partagée en famille",
    "application gestion de tâches visuelle",
    "meilleure appli gratuite pour s'organiser",
    "application liste de tâches simple",
  ],
  openGraph: {
    title: "TaskFlow — Moins de chaos. Plus de progrès.",
    description:
      "Application gratuite de gestion de tâches : priorités, échéances et suivi de progression.",
    type: "website",
    locale: "fr_FR",
    images: ["/images/landing/clarte.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "TaskFlow — Moins de chaos. Plus de progrès.",
    description:
      "Application gratuite de gestion de tâches : priorités, échéances et suivi de progression.",
    images: ["/images/landing/clarte.jpg"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#111426",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body
        className={`${dmSans.variable} ${manrope.variable} bg-[#f7f8fc] text-[#182033] antialiased`}
        style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
