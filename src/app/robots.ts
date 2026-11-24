import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const ready = process.env.SITE_READY_FOR_INDEXING === "true";
  const site = (process.env.NEXT_PUBLIC_SITE_URL || "https://ai-profi.pro").replace(/\/$/, "");

  return {
    rules: ready
      ? { userAgent: "*", allow: "/", disallow: ["/api/", "/signin", "/signup", "/blog-details", "/blog-sidebar", "/error"] }
      : { userAgent: "*", disallow: "/" },
    sitemap: ready ? site + "/sitemap.xml" : undefined,
  };
}
