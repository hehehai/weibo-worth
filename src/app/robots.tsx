import { baseHost } from "@/lib/site-meta";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: ["/api/*"],
    },
    sitemap: baseHost + "/sitemap.xml",
  };
}
