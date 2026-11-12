import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { sections, type ImageGroup, type Product, type Section } from "@/data/gifts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Holiday Gift Guide | Considered Gifts for Everyone" },
      { name: "description", content: "A holiday gift guide room by room, from everyday upgrades to serveware for the bon vivant." },
      { property: "og:title", content: "Holiday Gift Guide" },
      { property: "og:description", content: "Considered holiday gifts, styled as editorial still lifes room by room." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function useReveal() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll<HTMLElement>(".reveal").forEach((e) => e.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => en.isIntersecting && (en.target.classList.add("is-visible"), io.unobserve(en.target))),
      { rootMargin: "0px 0px -5% 0px" },
    );
    const scan = () => document.querySelectorAll<HTMLElement>(".reveal:not(.is-visible)").forEach((e) => io.observe(e));
    scan();
    // Watch for content added or swapped after first load so it never stays hidden.
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => (io.disconnect(), mo.disconnect());
  }, []);
}

function useActiveSection() {
  const [active, setActive] = useState<string>("");
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => en.isIntersecting && setActive(en.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return active;
}

function Index() {
  useReveal();
  const active = useActiveSection();
  return (
    <div className={`room-${active || sections[0]?.id} velvet font-serif text-cream transition-[background-color] duration-1000 ease-in-out`}>
      <header className="flex max-h-[30vh] flex-col justify-center px-4 py-6 md:px-12 md:py-8">
        <h1 className="reveal font-display text-[clamp(2.25rem,6vw,4.5rem)] font-[200] uppercase leading-none tracking-tight">
          Holiday Gift Guide
        </h1>
        <p className="reveal mt-2 text-lg font-light italic text-cream/85 md:text-xl">
          Placeholder intro: considered gifts for everyone on your list, gathered room by room.
        </p>
      </header>

      <nav aria-label="Gift categories" className="sticky top-0 z-30 h-12 border-y border-cream/20 bg-background/90 backdrop-blur">
        <ul className="flex h-full items-center gap-6 overflow-x-auto px-4 font-label text-xs uppercase tracking-[0.25em] md:justify-center md:gap-12">
          {sections.map((s) => (
            <li key={s.id} className={`room-${s.id} shrink-0`}>
              <a
                href={`#${s.id}`}
                aria-current={active === s.id ? "true" : undefined}
                className={`border-b pb-1 transition-colors ${active === s.id ? "border-room-accent text-room-accent" : "border-transparent text-cream/70 hover:text-cream"}`}
              >
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <main>
        {sections.map((s) => (
          <GiftSection key={s.id} section={s} />
        ))}
      </main>

      <footer className="px-4 py-8 text-center text-lg italic text-cream/80 md:px-12">
        Photography by Elizabeth Lavin; styling by Adam Fortner and Jamie Laubhan-Oliver.
      </footer>
    </div>
  );
}

function SectionTitle({ section }: { section: Section }) {
  return (
    <header className="reveal mb-6 flex flex-col gap-1 md:flex-row md:items-baseline md:gap-6">
      <h2 id={`${section.id}-h`} className="font-display text-[1.75rem] font-[200] uppercase leading-none tracking-tight md:text-[2.5rem]">
        {section.title}
      </h2>
      <p className="text-lg font-light italic text-room-accent md:text-xl">{section.dek}</p>
    </header>
  );
}

function BuyButton({ p }: { p: Product }) {
  if (!p.buttonText) return null;
  if (!p.buyUrl)
    return <span className="inline-block shrink-0 font-label text-[0.65rem] uppercase tracking-[0.15em] text-cream/60">{p.buttonText}</span>;
  return (
    <a
      href={p.buyUrl}
      target="_blank"
      rel="noopener noreferrer sponsored"
      aria-label={`Buy ${p.name} at ${p.vendor}`}
      className="inline-block shrink-0 border border-room-accent/70 px-2 py-0.5 font-label text-[0.65rem] uppercase tracking-[0.15em] text-room-accent transition-colors hover:bg-room-accent/15"
    >
      {p.buttonText}
    </a>
  );
}

function ProductLine({ p }: { p: Product }) {
  return (
    <div>
      <h3 className="font-label text-xs font-semibold uppercase leading-snug tracking-[0.08em] text-cream">
        {p.nameParts ? p.nameParts.map((pt, i) => (pt.italic ? <i key={i}>{pt.text}</i> : <span key={i}>{pt.text}</span>)) : p.name}
      </h3>
      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
        <p className="text-base leading-tight text-cream/80">
          {p.vendor}
          <span className="text-room-accent"> · {p.price}</span>
        </p>
        <BuyButton p={p} />
      </div>
      {p.note && <p className="mt-2 border-l border-room-accent pl-3 text-sm italic text-cream/85">{p.note}</p>}
    </div>
  );
}

function GroupCard({ group }: { group: ImageGroup }) {
  return (
    <li className="reveal">
      <article className="lift">
        <div className="paper-grain aspect-[4/5] overflow-hidden bg-blush">
          <img src={group.image} alt={group.alt} loading="lazy" decoding="async" width={480} height={600} className="size-full object-cover" />
        </div>
        <ul className={`mt-2 ${group.products.length > 1 ? "divide-y divide-cream/15" : ""}`}>
          {group.products.map((p) => (
            <li key={p.name} className="py-1.5">
              <ProductLine p={p} />
            </li>
          ))}
        </ul>
      </article>
    </li>
  );
}

function StillLife({ group }: { group: ImageGroup }) {
  return (
    <div className="grid gap-6 md:grid-cols-[55fr_45fr] md:items-start">
      <figure className="reveal paper-grain">
        <img src={group.image} alt={group.alt} loading="lazy" decoding="async" width={1200} height={900} className="max-h-[50vh] w-full object-cover md:max-h-[70vh]" />
        <figcaption className="mt-2 font-label text-xs uppercase tracking-[0.3em] text-room-accent">Clockwise from left</figcaption>
      </figure>
      <ol className="reveal grid gap-3">
        {group.products.map((p, i) => (
          <li key={p.name} className="flex gap-3 border-t border-room-accent/40 pt-2">
            <span className="font-display text-lg font-[200] text-room-accent">{String(i + 1).padStart(2, "0")}</span>
            <ProductLine p={p} />
          </li>
        ))}
      </ol>
    </div>
  );
}

function GiftSection({ section }: { section: Section }) {
  return (
    <section id={section.id} aria-labelledby={`${section.id}-h`} className={`room-${section.id} scroll-mt-12 px-4 py-8 md:px-12`}>
      <div className="mx-auto max-w-7xl">
        <SectionTitle section={section} />
        {section.layout === "grid" ? (
          <ul className="grid grid-cols-2 items-start gap-x-4 gap-y-6 lg:grid-cols-3 xl:grid-cols-4">
            {section.groups.map((g) => (
              <GroupCard key={g.id} group={g} />
            ))}
          </ul>
        ) : (
          <div className="grid gap-12">{section.groups.map((g) => <StillLife key={g.id} group={g} />)}</div>
        )}
      </div>
    </section>
  );
}
