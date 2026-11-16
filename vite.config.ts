// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// Never set ssr.external or resolve.external: the Worker has no runtime module resolution, so
// the build fails. Never add compression (compressPublicAssets, vite-plugin-compression):
// hosting already compresses at the edge.
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { writeFileSync } from "node:fs";
import { build } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";
import { createFeed, structuredData, siteUrl } from "./src/data/gift-seo";

function generateGiftExports() {
  writeFileSync("public/gift-guide.json", JSON.stringify(createFeed(), null, 2));
  writeFileSync("public/gift-guide-jsonld.json", JSON.stringify(structuredData, null, 2));
  writeFileSync("public/sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${siteUrl}</loc></url></urlset>`);
  writeFileSync("public/robots.txt", `User-agent: *\nAllow: /\nSitemap: ${new URL("sitemap.xml", siteUrl).href}\n`);
}

// Builds the router-free WordPress embed (public/embed/gift-guide.js + .css) once per production build.
let embedBuilt = false;
async function buildEmbed() {
  if (embedBuilt || process.env.GIFT_EMBED_CHILD) return;
  embedBuilt = true;
  process.env.GIFT_EMBED_CHILD = "1";
  await build({
    configFile: false,
    plugins: [react(), tailwindcss()],
    resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
    define: { "process.env.NODE_ENV": '"production"' },
    build: {
      outDir: "public/embed", emptyOutDir: true, copyPublicDir: false, cssCodeSplit: false,
      lib: { entry: "src/embed.tsx", formats: ["iife"], name: "GiftGuideEmbed", fileName: () => "gift-guide.js", cssFileName: "gift-guide" },
    },
  });
}

export default defineConfig({
  vite: { plugins: [{ name: "gift-guide-exports", async buildStart() { generateGiftExports(); if (this.environment?.config.command === "build" || process.env.NODE_ENV === "production") await buildEmbed(); } }] },
  tanstackStart: {
    pages: [{ path: "/" }],
    prerender: { enabled: true, autoStaticPathsDiscovery: false },
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
