/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Pas de variante 3840 px : inutile pour un fond sombre
    deviceSizes: [640, 828, 1080, 1280, 1920],
    // Next.js 16 n'accepte que les qualités déclarées ici :
    // sans le 60, quality={60} serait ramené à 75
    qualities: [60, 75],
    // Les images de la landing ne changent pas : cache d'un mois
    minimumCacheTTL: 2678400,
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
  experimental: {
    agentFeedback: true,
  },

  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
