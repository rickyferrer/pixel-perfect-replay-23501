// Scopes the embed stylesheet to #gift-guide-root so host themes (WordPress) can't override it
// and it can't restyle the host page. Cascade layers are unwrapped because any unlayered host
// rule beats every layered rule; the ID prefix then gives our rules higher specificity.
import postcss, { type Root } from "postcss";

export const EMBED_ROOT = "#gift-guide-root";
const ROOT_ONLY = /^(?::root|:host|html|body)$/;
const ROOT_LEAD = /^((?::root|html)[^\s>+~]*|\.has-js|\.dark)(?=[\s>+~]|$)/;

export function scopeSelector(sel: string): string {
  const s = sel.trim();
  if (ROOT_ONLY.test(s)) return EMBED_ROOT;
  const lead = s.match(ROOT_LEAD);
  if (lead) {
    const rest = s.slice(lead[0].length).trim();
    const head = lead[0] === "html" || lead[0] === ":root" ? "" : `${lead[0]} `;
    return rest ? `${head}${EMBED_ROOT} ${rest}` : `${head}${EMBED_ROOT}`;
  }
  if (s.startsWith(EMBED_ROOT)) return s;
  return `${EMBED_ROOT} ${s}`;
}

const remToPx = (v: string) => v.replace(/(-?\d*\.?\d+)rem\b/g, (_, n) => `${+(parseFloat(n) * 16).toFixed(4)}px`);

// Host themes style bare elements (h3 { font-size: 48px; color: #111 }); reset what Tailwind's
// preflight leaves alone. Specificity stays below utilities so our classes still win.
export const HOST_RESET = `${EMBED_ROOT} :is(h1,h2,h3,h4,h5,h6,p,a,li,ul,ol,figure,figcaption,blockquote,span,small,nav,header,section,article){color:inherit;font-family:inherit;font-size:inherit;line-height:inherit;text-transform:inherit;text-shadow:none}`;

export function scopeEmbedCss(css: string): string {
  const root: Root = postcss.parse(css);
  root.prepend(postcss.parse(HOST_RESET));
  root.walkAtRules("layer", (at) => { if (at.nodes) at.replaceWith(at.nodes); else at.remove(); });
  root.walkRules((rule) => {
    const parent = rule.parent;
    if (parent?.type === "atrule" && /keyframes$/.test((parent as postcss.AtRule).name)) return;
    rule.selectors = rule.selectors.map(scopeSelector);
  });
  // Host themes often set html font-size (e.g. 62.5%); fixed pixels keep sizes independent of it.
  root.walkDecls((d) => { if (d.value.includes("rem")) d.value = remToPx(d.value); });
  return root.toString();
}
