import categories from "./categories.json";

export type SectionId = "elevate" | "using" | "tastemaker" | "littles" | "bonvivant" | "reader" | "host";

export interface Product {
  name: string;
  /** Optional rich name, e.g. for italic book titles. */
  nameParts?: { text: string; italic?: boolean }[];
  vendor: string;
  price: string;
  /** Empty string means no shop link. */
  buyUrl: string;
  /** Label for the button. Empty hides it. */
  buttonText: string;
  image: string;
  note?: string;
}

export interface ImageGroup {
  id: string;
  image: string;
  alt: string;
  products: Product[];
}

export interface Section {
  id: SectionId;
  title: string;
  dek: string;
  layout: "grid" | "still-life";
  groups: ImageGroup[];
}

const META: { match: string; id: SectionId; title: string; dek: string }[] = [
  { match: "Elevate", id: "elevate", title: "Elevate the Everyday", dek: "Elegant upgrades for every facet of life" },
  { match: "Worth Using", id: "using", title: "Gifts Worth Using", dek: "Utilitarian essentials, beautifully reimagined" },
  { match: "Taste Maker", id: "tastemaker", title: "For the Tastemaker", dek: "Fashion-forward accessories designed to stand out" },
  { match: "Little Humans", id: "littles", title: "Little Luxuries for Little Humans", dek: "Placeholder: small treasures for the youngest on your list" },
  { match: "Bon Vivant", id: "bonvivant", title: "For the Bon Vivant", dek: "Serveware, snacks, and other tasteful indulgences" },
  { match: "Avid Reader", id: "reader", title: "For the Avid Reader", dek: "Placeholder: handsome editions for the bookshelf" },
  { match: "Consummate Host", id: "host", title: "For the Consummate Host", dek: "Placeholder: everything for a well-set table" },
];
const NOTES: Record<string, string> = {
  FrischSchoggi: "Läderach's array of barks, available at the Swiss chocolatier's NorthPark outpost, makes a gift for any gourmand.",
};
const ITALIC: Record<string, Product["nameParts"]> = {
  "The Grapes of Wrath leather-bound edition": [{ text: "The Grapes of Wrath", italic: true }, { text: " leather-bound edition" }],
};

const enrich = (p: Product): Product => {
  const out: Product = { ...p };
  const note = p.note ?? NOTES[p.name];
  if (note) out.note = note;
  const parts = ITALIC[p.name];
  if (parts) out.nameParts = parts;
  return out;
};

/** Products sharing a photo become one group, in sheet order. */
export function groupByImage(products: Product[], sectionId: string): ImageGroup[] {
  const map = new Map<string, ImageGroup>();
  products.forEach((p) => {
    const key = p.image || p.name;
    let grp = map.get(key);
    if (!grp) {
      grp = { id: `${sectionId}-${map.size}`, image: p.image || "/placeholder.svg", alt: p.name, products: [] };
      map.set(key, grp);
    }
    grp.products.push(p);
  });
  for (const grp of map.values()) grp.alt = grp.products.map((p) => p.name).join(", ");
  return [...map.values()];
}

export const sections: Section[] = (categories as { title: string; products: Product[] }[])
  .filter((c) => c.products.length > 0)
  .map((c) => {
    const meta = META.find((m) => c.title.includes(m.match));
    if (!meta) throw new Error(`Unknown category in sheet: ${c.title}`);
    const groups = groupByImage(c.products.map(enrich), meta.id);
    const layout = meta.id === "host" || groups.length === 1 && (groups[0]?.products.length ?? 0) > 2 ? "still-life" : "grid";
    return { id: meta.id, title: meta.title, dek: meta.dek, layout, groups };
  });
