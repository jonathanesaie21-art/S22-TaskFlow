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
    "TaskFlow vous aide à centraliser vos tâches, suivre vos priorités et avancer sereinement vers vos objectifs.",
  openGraph: {
    title: "TaskFlow — Moins de chaos. Plus de progrès.",
    description: "Centralisez vos tâches et suivez votre progression.",
    type: "website",
    locale: "fr_FR",
    images: ["/images/landing/clarte.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "TaskFlow — Moins de chaos. Plus de progrès.",
    description: "Centralisez vos tâches et suivez votre progression.",
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
