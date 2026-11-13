import categories from "./categories.json";

export type SectionId = "elevate" | "using" | "tastemaker" | "littles" | "bonvivant" | "reader" | "host";
export interface Product {
  name: string;
  vendor: string;
  price: string;
  buyUrl: string;
  image: string;
  sponsored: boolean;
  sponsorBlurb: string;
  note?: string;
}
export interface ImageGroup { id: string; image: string; alt: string; products: Product[] }
export interface Section { id: SectionId; title: string; dek: string; layout: "grid" | "still-life"; groups: ImageGroup[] }

const META: { match: string; id: SectionId; dek: string }[] = [
  { match: "Elevate", id: "elevate", dek: "Elegant upgrades for every facet of life" },
  { match: "Worth Using", id: "using", dek: "Utilitarian essentials, beautifully reimagined" },
  { match: "Taste Maker", id: "tastemaker", dek: "Fashion-forward accessories designed to stand out" },
  { match: "Little Humans", id: "littles", dek: "Small treasures for the youngest on your list" },
  { match: "Bon Vivant", id: "bonvivant", dek: "Serveware, snacks, and other tasteful indulgences" },
  { match: "Avid Reader", id: "reader", dek: "Handsome additions to the bookshelf" },
  { match: "Consummate Host", id: "host", dek: "Everything for a well-set table" },
];

export function groupByImage(products: Product[], sectionId: string): ImageGroup[] {
  const map = new Map<string, ImageGroup>();
  products.forEach((p, i) => {
    const key = p.image || `missing-${i}`;
    let group = map.get(key);
    if (!group) {
      group = { id: `${sectionId}-${map.size}`, image: p.image || "/placeholder.svg", alt: "", products: [] };
      map.set(key, group);
    }
    group.products.push(p);
  });
  for (const group of map.values()) group.alt = group.products.map((p) => p.name).join(", ");
  return [...map.values()];
}

export const sections: Section[] = categories.map((category) => {
  const meta = META.find((m) => category.title.includes(m.match));
  if (!meta) throw new Error(`Unknown category: ${category.title}`);
  const groups = groupByImage(category.products, meta.id);
  return { id: meta.id, title: category.title, dek: meta.dek, groups,
    layout: meta.id === "host" || (groups.length === 1 && (groups[0]?.products.length ?? 0) > 2) ? "still-life" : "grid" };
});