import { useEffect } from "react";

// D Magazine GAM network; same horizontal unit as the Recording Artists page.
export const AD_UNIT = "/23334079222/MissEllie_horizontal";

type GoogleTag = { cmd: Array<() => void>; pubads: () => any; enableServices: () => void; defineSlot: (u: string, s: number[], id: string) => any; display: (id: string) => void; destroySlots: (s: any[]) => void };
declare global { interface Window { googletag?: GoogleTag } }

// Reuses the host page's GPT (standard or limited-ads domain) when present; otherwise loads it once, from the component, so it works on the guide site and in the WordPress embed.
function loadGpt(): GoogleTag {
  const gt = (window.googletag = window.googletag || { cmd: [] } as unknown as GoogleTag);
  if (!document.querySelector('script[src*="/tag/js/gpt.js"]')) {
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://securepubads.g.doubleclick.net/tag/js/gpt.js";
    document.head.appendChild(s);
  }
  if (!(window as any).__giftGuideGptReady) {
    (window as any).__giftGuideGptReady = true;
    gt.cmd.push(() => { const g = gt as any; if (typeof g.setConfig === "function") g.setConfig({ collapseDiv: "ON_NO_FILL" }); else gt.pubads().collapseEmptyDivs(); gt.enableServices(); });
  }
  return gt;
}

export function AdSlot({ id }: { id: string }) {
  useEffect(() => {
    const gt = loadGpt();
    let slot: any = null;
    gt.cmd.push(() => {
      slot = gt.defineSlot(AD_UNIT, [970, 250], id);
      if (!slot) return;
      slot.addService(gt.pubads());
      gt.display(id);
    });
    return () => { gt.cmd.push(() => { if (slot) gt.destroySlots([slot]); }); };
  }, [id]);
  return <aside aria-label="Advertisement" className="gift-ad px-4 py-6 md:px-12">
    <p className="mb-2 text-center font-label text-xs uppercase text-cream/70">Advertisement</p>
    <div className="overflow-x-auto"><div id={id} className="mx-auto min-h-[250px] w-[970px] max-w-none" /></div>
  </aside>;
}
