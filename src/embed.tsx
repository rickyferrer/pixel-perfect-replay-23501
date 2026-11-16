// Standalone guide for pasting into other sites (WordPress): no router, mounts into #gift-guide-root.
import { createRoot } from "react-dom/client";
import "./styles.css";
import { GiftGuide } from "@/components/GiftGuide";
import { absoluteAssetUrl } from "@/data/asset-urls";
import regular from "@/assets/founders-grotesk-regular.asset.json";
import bold from "@/assets/founders-grotesk-bold.asset.json";
import italic from "@/assets/founders-grotesk-regular-italic.asset.json";
import boldItalic from "@/assets/founders-grotesk-bold-italic.asset.json";

const faces = [[regular, 400, "normal"], [bold, 700, "normal"], [italic, 400, "italic"], [boldItalic, 700, "italic"]] as const;
const style = document.createElement("style");
style.textContent = faces.map(([a, w, s]) => `@font-face{font-family:"Founders Grotesk";src:url("${absoluteAssetUrl(a.url)}") format("opentype");font-weight:${w};font-style:${s};font-display:swap}`).join("");
document.head.appendChild(style);
const fonts = document.createElement("link");
fonts.rel = "stylesheet";
fonts.href = "https://fonts.googleapis.com/css2?family=Antonio:wght@100;200;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Oswald:wght@400;600&display=swap";
document.head.appendChild(fonts);

// The script may be linked in the page head (WordPress "Javascript Link"), before the
// placeholder div exists, so mount once the document has been parsed.
function mount() {
  const el = document.getElementById("gift-guide-root");
  if (el && !el.dataset["mounted"]) { el.dataset["mounted"] = "1"; createRoot(el).render(<GiftGuide />); }
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
else mount();
