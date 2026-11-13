import { createFileRoute } from "@tanstack/react-router";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { sections, type ImageGroup, type Product, type Section } from "@/data/gifts";
import { guideDescription, isBuyUrl, jsonLd, shareImage, siteUrl } from "@/data/gift-seo";

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
  component: Index,
});

function useReveal() {
  useEffect(() => {
    document.documentElement.classList.add("has-js");
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); io.unobserve(entry.target); }
    }), { rootMargin: "0px 0px -5% 0px" });
    const scan = () => document.querySelectorAll<HTMLElement>(".reveal:not(.is-visible)").forEach((el) => io.observe(el));
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); document.documentElement.classList.remove("has-js"); };
  }, []);
}

function useActiveSection() {
  const [active, setActive] = useState(sections[0]?.id ?? "elevate");
  useEffect(() => {
    const update = () => {
      let current = sections[0]?.id ?? "elevate";
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element && element.getBoundingClientRect().top <= window.innerHeight * 0.4) current = section.id;
      }
      setActive(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);
  return active;
}

const SponsorContext = createContext<{ open: string | null; setOpen: (id: string | null) => void }>({ open: null, setOpen: () => {} });

function Index() {
  useReveal();
  const active = useActiveSection();
  const [open, setOpen] = useState<string | null>(null);
  useEffect(() => {
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(null); };
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Element && !event.target.closest(`[data-sponsor-id="${open}"]`)) setOpen(null);
    };
    document.addEventListener("keydown", escape);
    document.addEventListener("pointerdown", outside);
    return () => { document.removeEventListener("keydown", escape); document.removeEventListener("pointerdown", outside); };
  }, [open]);
  return (
    <SponsorContext.Provider value={{ open, setOpen }}>
      <div className={`room-${active} velvet font-serif text-cream transition-[background-color] duration-1000 ease-in-out`}>
        <header className="guide-banner px-4 py-6 md:px-12">
          <h1 className="reveal font-display text-4xl font-[200] uppercase leading-none md:text-6xl">Holiday Gift Guide</h1>
          <p className="reveal mt-2 text-lg font-light italic text-cream/85">Considered holiday gifts for everyone on your list.</p>
        </header>
        <nav aria-label="Gift categories" className="sticky top-0 z-40 h-12 border-y border-cream/20 bg-background/90 backdrop-blur">
          <ul className="mx-auto flex h-full max-w-7xl items-center gap-6 overflow-x-auto px-4 font-label text-xs uppercase md:gap-8">
            {sections.map((section) => (
              <li key={section.id} className={`room-${section.id} shrink-0`}>
                <a href={`#${section.id}`} aria-current={active === section.id ? "true" : undefined}
                  className={`category-link border-b pb-1 transition-colors ${active === section.id ? "border-room-accent text-room-accent" : "border-transparent text-cream/70 hover:text-cream"}`}>
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <main>{sections.map((section) => <GiftSection key={section.id} section={section} />)}</main>
        <footer className="px-4 py-8 text-center text-lg italic text-cream/80 md:px-12">Photography by Elizabeth Lavin; styling by Adam Fortner and Jamie Laubhan-Oliver.</footer>
      </div>
    </SponsorContext.Provider>
  );
}

function ProductBody({ product }: { product: Product }) {
  return <div>
    {product.sponsored && <p className="mb-1 font-label text-xs uppercase text-room-accent">Sponsored</p>}
    <h3 className="font-label text-xs font-semibold uppercase leading-snug text-cream">{product.name}</h3>
    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
      <p className="text-base leading-tight text-cream/80">{product.vendor}<span className="text-room-accent"> · {product.price}</span></p>
      {isBuyUrl(product.buyUrl) && <span className="buy-cue border border-room-accent/70 px-2 py-0.5 font-label text-[0.65rem] uppercase text-room-accent">Buy at {product.vendor}</span>}
    </div>
    {product.note && <p className="mt-2 text-sm italic text-cream/85">{product.note}</p>}
  </div>;
}

function GiftLink({ product, children }: { product: Product; children: ReactNode }) {
  if (!isBuyUrl(product.buyUrl)) return <div>{children}</div>;
  return <a className="gift-link block" href={product.buyUrl} target="_blank" rel="noopener noreferrer sponsored" aria-label={`Buy ${product.name} at ${product.vendor}`}>{children}</a>;
}

function GiftFrame({ product, id, children }: { product: Product; id: string; children: ReactNode }) {
  const { open, setOpen } = useContext(SponsorContext);
  const expanded = open === id;
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const previouslyOpen = useRef(false);
  useEffect(() => {
    const focusTimer = expanded ? window.setTimeout(() => panelRef.current?.focus({ preventScroll: true }), 220) : undefined;
    if (!expanded && previouslyOpen.current) buttonRef.current?.focus({ preventScroll: true });
    previouslyOpen.current = expanded;
    return () => window.clearTimeout(focusTimer);
  }, [expanded]);
  return <article className="gift-frame" data-sponsor-id={id}>
    {children}
    {product.sponsored && <>
      <Button ref={buttonRef} variant="editorial" size="sm" className="sponsor-toggle" aria-expanded={expanded} aria-controls={`${id}-blurb`} onClick={() => setOpen(expanded ? null : id)}>{expanded ? "Close" : "Read more"}</Button>
      <div ref={panelRef} id={`${id}-blurb`} role="region" aria-label={`About ${product.name} from ${product.vendor}`} tabIndex={expanded ? -1 : undefined} aria-hidden={!expanded} className={`sponsor-panel ${expanded ? "is-open" : ""}`}>
        <p className="mb-2 font-label text-xs uppercase text-room-accent">Sponsored · {product.vendor}</p>
        <p className="text-base leading-snug">{product.sponsorBlurb || "A thoughtful holiday gift, selected to bring a little luxury to the season."}</p>
      </div>
    </>}
  </article>;
}

function GroupImage({ group, still = false }: { group: ImageGroup; still?: boolean }) {
  return <div className={`paper-grain overflow-hidden bg-blush ${still ? "still-image" : "aspect-[4/5]"}`}>
    <img src={group.image} alt={group.alt} loading="lazy" decoding="async" width={480} height={600} className={`size-full ${still ? "object-contain" : "object-cover"}`} />
  </div>;
}

function ProductRow({ product, id, number }: { product: Product; id: string; number?: number }) {
  return <GiftFrame product={product} id={id}>
    <GiftLink product={product}><div className="flex gap-3 py-2">
      {number !== undefined && <span className="font-display text-lg font-[200] text-room-accent">{String(number + 1).padStart(2, "0")}</span>}
      <ProductBody product={product} />
    </div></GiftLink>
  </GiftFrame>;
}

function GroupCard({ group }: { group: ImageGroup }) {
  const single = group.products.length === 1 ? group.products[0] : undefined;
  return <li className="reveal">
    {single ? <GiftFrame product={single} id={group.id}>
      <GiftLink product={single}><GroupImage group={group} /><div className="pt-2"><ProductBody product={single} /></div></GiftLink>
    </GiftFrame> : <article>
      <GroupImage group={group} />
      <ul className="mt-2 divide-y divide-cream/15">{group.products.map((product, i) => <li key={`${group.id}-${i}`}><ProductRow product={product} id={`${group.id}-${i}`} /></li>)}</ul>
    </article>}
  </li>;
}

function StillLife({ group, reverse }: { group: ImageGroup; reverse: boolean }) {
  return <div className={`still-row ${reverse ? "is-reversed" : ""}`}>
    <figure className="reveal"><GroupImage group={group} still /></figure>
    <ol className="reveal grid gap-2">{group.products.map((product, i) => <li key={`${group.id}-${i}`} className="border-t border-room-accent/40"><ProductRow product={product} id={`${group.id}-${i}`} number={i} /></li>)}</ol>
  </div>;
}

function GiftSection({ section }: { section: Section }) {
  return <section id={section.id} aria-labelledby={`${section.id}-h`} className={`room-${section.id} scroll-mt-12 px-4 py-8 md:px-12`}>
    <div className="mx-auto max-w-7xl">
      <header className="reveal mb-6 flex flex-col gap-1 md:flex-row md:flex-wrap md:items-baseline md:gap-x-6">
        <h2 id={`${section.id}-h`} className="font-display text-[1.75rem] font-[200] uppercase leading-tight md:text-[2.5rem]">{section.title}</h2>
        <p className="text-base font-light italic text-room-accent md:text-lg">{section.dek}</p>
      </header>
      {section.layout === "grid" ? <ul className="grid grid-cols-2 items-start gap-x-4 gap-y-6 lg:grid-cols-3 xl:grid-cols-4">{section.groups.map((group) => <GroupCard key={group.id} group={group} />)}</ul>
        : <div className="grid gap-8">{section.groups.map((group, i) => <StillLife key={group.id} group={group} reverse={section.id === "host" && i % 2 === 1} />)}</div>}
    </div>
  </section>;
}