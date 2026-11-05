// N'autorise que les chemins internes (empêche les redirections vers un autre site).
export function safeRedirect(value, fallback = "/dashboard") {
  if (typeof value !== "string") return fallback;
  if (!value.startsWith("/") || value.startsWith("//")) return fallback;
  if (value.includes("\\") || /[\u0000-\u001f]/.test(value)) return fallback;
  return value;
}
