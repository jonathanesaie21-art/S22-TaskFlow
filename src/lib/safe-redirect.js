// Empêche les redirections ouvertes (open redirect) : seul un chemin interne
// de ce site est accepté. Tout le reste retombe sur `fallback`.
export function safeCallbackUrl(value, fallback = "/dashboard") {
  if (typeof value !== "string" || value.length === 0 || value.length > 500) {
    return fallback;
  }
  // Doit commencer par un seul "/" ; "//" et "/\" sont interprétés comme des URL externes.
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return fallback;
  }
  // Caractères de contrôle (tabulation, retour à la ligne...) utilisés pour contourner les filtres.
  if (/[\u0000-\u001f\u007f]/.test(value)) return fallback;

  try {
    const url = new URL(value, "http://localhost");
    if (url.origin !== "http://localhost") return fallback;
    return url.pathname + url.search + url.hash;
  } catch {
    return fallback;
  }
}
