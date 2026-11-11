import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { products, sections, type Product, type Section } from "@/data/gifts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "L.A.B.L. Gifts | D Home Winter 2026 Gift Guide" },
      { name: "description", content: "D Home's Winter 2026 holiday gift guide, from everyday upgrades to serveware for the bon vivant." },
      { property: "og:title", content: "L.A.B.L. Gifts | D Home Winter 2026" },
      { property: "og:description", content: "A holiday gift guide styled as an editorial still life, in four rooms." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => en.isIntersecting && (en.target.classList.add("is-visible"), io.unobserve(en.target))),
      { rootMargin: "0px 0px -10% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
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
    <div className="bg-background font-serif text-cream">
      <header className="px-6 pt-6 md:px-12">
        <div className="flex items-center justify-between font-label text-xs uppercase tracking-[0.3em]">
          <span>L.A.B.L.</span>
          <span className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-folio-dot" aria-hidden />
            gifts
            <span className="size-1.5 rounded-full bg-folio-dot" aria-hidden />
          </span>
        </div>
        <hr className="mt-4 border-cream/40" />
      </header>

      <section className="px-6 pb-20 pt-16 md:px-12 md:pt-24">
        <p className="reveal font-label text-xs uppercase tracking-[0.4em] text-blush">D Home · Winter 2026</p>
        <h1 className="reveal mt-4 font-display text-[clamp(6rem,22vw,18rem)] font-[100] uppercase leading-[0.85] tracking-tight">
          Gifts
        </h1>
        <p className="reveal mt-8 max-w-xl text-2xl font-light leading-snug text-cream/85 md:text-3xl">
          Placeholder intro. A season of considered objects, gathered from shops across Dallas and styled as still lifes, room by room.
        </p>
      </section>

      <nav aria-label="Gift categories" className="sticky top-0 z-30 border-y border-cream/20 bg-background/90 backdrop-blur">
        <ul className="flex gap-6 overflow-x-auto px-6 py-4 font-label text-xs uppercase tracking-[0.25em] md:justify-center md:gap-12">
          {sections.map((s) => (
            <li key={s.id} className={`room-${s.id} shrink-0`}>
              <a
                href={`#${s.id}`}
                aria-current={active === s.id ? "true" : undefined}
                className={`border-b pb-1 transition-colors ${active === s.id ? "border-room-accent text-room-accent" : "border-transparent text-cream/70 hover:text-cream"}`}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <main>
        {sections.map((s) => (
          <GiftSection key={s.id} section={s} items={products.filter((p) => p.section === s.id)} />
        ))}
      </main>

      <footer className="px-6 py-12 text-center text-lg italic text-cream/80 md:px-12">
        <hr className="mb-8 border-cream/30" />
        Photography by Elizabeth Lavin; styling by Adam Fortner and Jamie Laubhan-Oliver.
      </footer>
    </div>
  );
}

function SectionTitle({ section }: { section: Section }) {
  const offsets = ["md:ml-0", "md:ml-[18%]", "md:ml-[36%]"];
  return (
    <header className="reveal mb-16">
      <h2 id={`${section.id}-h`} aria-label={section.label} className="font-display text-[clamp(3.5rem,11vw,9.5rem)] font-[200] uppercase leading-[0.88] tracking-tight">
        {section.title.map((w, i) => (
          <span key={i} className={`block ${offsets[i] ?? ""}`}>{w}</span>
        ))}
      </h2>
      <p className="mt-6 max-w-lg text-2xl font-light italic text-room-accent md:ml-[36%]">{section.dek}</p>
    </header>
  );
}

function Name({ p }: { p: Product }) {
  return (
    <h3 className="font-label text-sm font-semibold uppercase tracking-[0.08em] text-cream">
      {p.nameParts ? p.nameParts.map((pt, i) => (pt.italic ? <i key={i}>{pt.text}</i> : <span key={i}>{pt.text}</span>)) : p.name}
    </h3>
  );
}

function Details({ p }: { p: Product }) {
  return (
    <div className="mt-3">
      <Name p={p} />
      <p className="mt-1 text-lg text-cream/80">
        {p.link ? (
          <a href={p.link} target="_blank" rel="noopener noreferrer" className="underline decoration-room-accent/60 underline-offset-4 hover:text-room-accent">
            {p.vendor}
          </a>
        ) : (
          p.vendor
        )}
        <span className="text-room-accent"> · {p.price}</span>
      </p>
      {p.note && <p className="mt-3 border-l border-room-accent pl-3 text-base italic text-cream/85">{p.note}</p>}
    </div>
  );
}

function GiftSection({ section, items }: { section: Section; items: Product[] }) {
  return (
    <section id={section.id} aria-labelledby={`${section.id}-h`} className={`room-${section.id} velvet scroll-mt-14 px-6 py-24 md:px-12`}>
      <div className="mx-auto max-w-7xl">
        <SectionTitle section={section} />
        {section.layout === "grid" ? (
          <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <li key={p.name} className="reveal">
                <article className="lift">
                  <div className="paper-grain aspect-square overflow-hidden bg-blush">
                    <img src={p.image} alt={p.alt} loading="lazy" decoding="async" width={600} height={600} className="size-full object-cover" />
                  </div>
                  <Details p={p} />
                </article>
              </li>
            ))}
          </ul>
        ) : (
          <>
            <figure className="reveal -mx-6 md:-mx-12">
              <img src={section.heroImage} alt={section.heroAlt} loading="lazy" decoding="async" width={1600} height={900} className="aspect-[16/9] w-full object-cover" />
              <figcaption className="mt-3 px-6 font-label text-xs uppercase tracking-[0.3em] text-room-accent md:px-12">Clockwise from left</figcaption>
            </figure>
            <ol className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {items.map((p, i) => (
                <li key={p.name} className="reveal lift paper-grain border-t border-room-accent/50 pt-4">
                  <span className="font-display text-3xl font-[200] text-room-accent">{String(i + 1).padStart(2, "0")}</span>
                  <img src={p.image} alt={p.alt} loading="lazy" decoding="async" width={400} height={400} className="mt-3 aspect-square w-full object-cover" />
                  <Details p={p} />
                </li>
              ))}
            </ol>
          </>
        )}
      </div>
    </section>
  );
}
