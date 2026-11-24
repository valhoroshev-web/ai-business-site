import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  if (process.env.SITE_READY_FOR_INDEXING !== "true") return [];
  const site = (process.env.NEXT_PUBLIC_SITE_URL || "https://ai-business-site-tau.vercel.app").replace(/\/$/, "");
  return [
    { url: site + "/", changeFrequency: "monthly", priority: 1 },
  ];
}
