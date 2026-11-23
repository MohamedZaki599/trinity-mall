import type { MetadataRoute } from "next";
import { units } from "@/content/project";
import { siteUrl } from "@/lib/env";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const paths = ["", "/units", "/corporate-partners", "/contact", "/privacy", "/terms"];

  return [
    ...paths.map((path) => ({
      url: `${siteUrl}${path}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...units.map((unit) => ({
      url: `${siteUrl}/units/${unit.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
