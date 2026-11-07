const base = "https://s22-taskflow.vercel.app";

// Change cette date uniquement quand le contenu des pages change vraiment
const LAST_UPDATE = new Date("2026-11-07");

export default function sitemap() {
  return [
    {
      url: base,
      lastModified: LAST_UPDATE,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/guide`,
      lastModified: LAST_UPDATE,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}
