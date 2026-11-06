export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/api/"],
      },
    ],
    sitemap: "https://s22-taskflow.vercel.app/sitemap.xml",
  };
}
