// src/app/robots.ts
import type { MetadataRoute } from "next";
import { headers } from "next/headers";

export const runtime = "edge";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const host =
    (await headers()).get("x-forwarded-host") ??
    (await headers()).get("host") ??
    "";

  // Determine the alternate domain based on current domain
  const isSpanish = host.includes("artehechoamano");
  const altDomain = isSpanish ? "handmadeart.store" : "artehechoamano.com";

  // Paths kept out of the index — user-private, transactional, or noisy.
  const disallowAll = [
    "/api/",
    "/admin/",
    "/_next/",
    "/auth/",
    "/account",
    "/account/",
    "/checkout",
    "/checkout/",
    "/cart",
    "/orders",
    "/orders/",
    "/search",            // dynamic search results — low quality for indexing
    // Tracking-param duplicates — canonical URLs cover the rest
    "/*?utm_*",
    "/*?ref=*",
    "/*?fbclid=*",
    "/*?gclid=*",
  ];

  return {
    rules: [
      // Default rule for traditional search-engine crawlers
      {
        userAgent: "*",
        allow: "/",
        disallow: disallowAll,
      },
      // Explicitly allow Google's AI bot (used for AI Overviews / SGE)
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: disallowAll,
      },
      // OpenAI's crawlers (powering ChatGPT search and citations)
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: disallowAll,
      },
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
        disallow: disallowAll,
      },
      // Anthropic's crawler (powering Claude.ai web access and citations)
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: disallowAll,
      },
      {
        userAgent: "Claude-Web",
        allow: "/",
        disallow: disallowAll,
      },
      // Perplexity, You.com, and other LLM-powered search engines
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: disallowAll,
      },
      {
        userAgent: "YouBot",
        allow: "/",
        disallow: disallowAll,
      },
      // Cohere and Meta's crawlers
      {
        userAgent: "cohere-ai",
        allow: "/",
        disallow: disallowAll,
      },
      {
        userAgent: "FacebookBot",
        allow: "/",
        disallow: disallowAll,
      },
    ],
    sitemap: [
      `https://${host}/sitemap.xml`,
      `https://${altDomain}/sitemap.xml`,
    ],
    host: `https://${host}`,
  };
}
