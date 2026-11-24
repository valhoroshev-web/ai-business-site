import type { MetadataRoute } from "next";
import { serviceSlugs } from "@/data/services";
import { useCaseSlugs } from "@/data/use-cases";

export default function sitemap(): MetadataRoute.Sitemap {
  if (process.env.SITE_READY_FOR_INDEXING !== "true") return [];

  const site = (process.env.NEXT_PUBLIC_SITE_URL || "https://ai-profi.pro").replace(/\/$/, "");
  return [
    { url: site + "/", changeFrequency: "monthly", priority: 1 },
    { url: site + "/use-cases", changeFrequency: "weekly", priority: 0.9 },
    { url: site + "/demo", changeFrequency: "monthly", priority: 0.7 },
    ...useCaseSlugs.map((slug) => ({
      url: site + "/use-cases/" + slug,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...serviceSlugs.map((slug) => ({
      url: site + "/services/" + slug,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
