import { createFileRoute } from "@tanstack/react-router";
import { GiftGuide } from "@/components/GiftGuide";
import { guideDescription, jsonLd, shareImage, siteUrl } from "@/data/gift-seo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Holiday Gift Guide | Considered Gifts for Everyone" },
      { name: "description", content: guideDescription },
      { property: "og:title", content: "Holiday Gift Guide" },
      { property: "og:description", content: guideDescription },
      { property: "og:type", content: "article" },
      { property: "og:url", content: siteUrl },
      { name: "twitter:card", content: "summary_large_image" },
      ...(shareImage?.startsWith("https://") ? [{ property: "og:image", content: shareImage }, { name: "twitter:image", content: shareImage }] : []),
    ],
    links: [{ rel: "canonical", href: siteUrl }, { rel: "alternate", type: "application/json", href: "/gift-guide.json" }],
    scripts: [{ type: "application/ld+json", children: jsonLd }],
  }),
  component: GiftGuide,
});
