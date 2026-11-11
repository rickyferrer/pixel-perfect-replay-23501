import products from "./products.json";

export type SectionId = "elevate" | "tastemaker" | "using" | "bonvivant" | "host";

export interface Product {
  name: string;
  /** Optional rich name, e.g. for italic book titles. */
  nameParts?: { text: string; italic?: boolean }[];
  vendor: string;
  price: string;
  /** Empty string means no shop link. */
  buyUrl: string;
  /** Label for the button, e.g. "Buy Now" or "In store only". Empty hides it. */
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

const all = products as Product[];
const NOTES: Record<string, string> = {
  FrischSchoggi: "Läderach's array of barks, available at the Swiss chocolatier's NorthPark outpost, makes a gift for any gourmand.",
};
const ITALIC: Record<string, Product["nameParts"]> = {
  "The Grapes of Wrath leather-bound edition": [{ text: "The Grapes of Wrath", italic: true }, { text: " leather-bound edition" }],
};

const find = (name: string): Product => {
  const p = all.find((x) => x.name === name);
  if (!p) throw new Error(`Product missing from sheet: ${name}`);
  const out: Product = { ...p };
  const note = p.note ?? NOTES[name];
  if (note) out.note = note;
  const parts = ITALIC[name];
  if (parts) out.nameParts = parts;
  return out;
};
const g = (id: string, alt: string, names: string[], image?: string): ImageGroup => {
  const items = names.map(find);
  return { id, image: image || items[0]?.image || "/placeholder.svg", alt, products: items };
};

export const sections: Section[] = [
  {
    id: "elevate", title: "Elevate the Everyday", dek: "Elegant upgrades for every facet of life", layout: "grid",
    groups: [
      g("card-holder", "Jan Barboglio El Sorteo card holder", ["Jan Barboglio “El Sorteo” card holder"]),
      g("pet-shampoo", "Santa Maria Novella shampoo for pets", ["Santa Maria Novella shampoo for pets"]),
      g("biscuit-tray", "Cathead biscuit cutter resting on a small round pewter tray", ["Cathead biscuit cutter", "Small round Match pewter tray"]),
      g("bain-marie", "Vintage 1880s copper bain marie set", ["Vintage 1880s Barron & Wilson copper bain marie"]),
      g("honey", "Jar of tupelo honey with a horn honey dipper", ["Larder tupelo honey", "Abbeyhorn honey dipper"]),
      g("sugar", "French sugar dish with tongs and flower-shaped sugar cubes", ["French sugar dish, tongs, and flower sugar cubes"]),
      g("diffuser", "Adlan Crowd Pleaser diffuser", ["Adlan “Crowd Pleaser” diffuser"]),
      g("dominoes", "Wood and brass dominoes set", ["Wood and brass dominoes set"]),
      g("napkin", "Cocktail napkin holder", ["Cocktail napkin holder"]),
      g("garden", "Bronze hand shovel beside a gardening pot", ["PKS bronze hand shovel", "Skultuna gardening pot"]),
      g("books", "Leather-bound book adorned with sterling silver book jewels", ["The Grapes of Wrath leather-bound edition", "Carma sterling silver book jewels"]),
      g("pitcher", "Glass horse pitcher with matching tumblers", ["Artel glassware horse pitcher and tumblers"]),
    ],
  },
  {
    id: "tastemaker", title: "For the Tastemaker", dek: "Fashion-forward accessories designed to stand out", layout: "still-life",
    groups: [g("tastemaker-still-life", "Still life of accessories for the tastemaker", [
      "Iridescent ribbed socks", "Costa Brazil “Aroma” eau de parfum", "Georg Jensen stainless steel wine coasters", "Vintage silver tray",
      "24K-gold-plated “Scarab” cow tie", "Bur Bur “The Mini Mermaid” detangling brush", "Breda “Pulse” tandem watch", "Pewter hip flask",
    ], "https://assets.dmagstatic.com/wp-content/uploads/2026/11/fashion-accessories-DHome-Winter-2026-VERT.webp")],
  },
  {
    id: "using", title: "Gifts Worth Using", dek: "Utilitarian essentials, beautifully reimagined", layout: "grid",
    groups: [
      g("vessel", "Chase Gamblin vessel", ["Chase Gamblin vessel"]),
      g("lamp", "Bocci 14P portable lamp", ["Bocci “14P” portable lamp"]),
      g("clutch-tray", "Leather dumpling clutch on an octagonal pewter tray", ["“Dumpling” clutch", "Match pewter octagonal tray"]),
      g("mortar", "Porcelain mortar and pestle", ["John Julian porcelain mortar and pestle"]),
      g("umbrella", "Mini umbrella with a horse-head handle", ["Mini horse umbrella"]),
      g("place-setting", "Noritake Hoshikage place setting", ["Noritake Hoshikage place setting"]),
      g("chiller", "Hand-crafted wine chiller and vase", ["Mercurio hand-crafted wine chiller and vase"]),
      g("fire-blanket", "Printworks fire blanket", ["Printworks fire blanket"]),
      g("boots", "Boot jack beside a pair of cowboy boots", ["Lela Rose x Berkely Beauchot boot jack", "“Jamie” boots"]),
      g("vintage-dominoes", "Circa-1970s dominoes", ["Circa-1970s dominoes"]),
      g("incense", "Ha Ko paper incense", ["Ha Ko paper incense"]),
      g("soap", "Trudon 1643 Carmen hand soap", ["Trudon 1643 “Carmen” hand soap"]),
    ],
  },
  {
    id: "bonvivant", title: "For the Bon Vivant", dek: "Serveware, snacks, and other tasteful indulgences", layout: "still-life",
    groups: [g("bonvivant-still-life", "Still life of serveware, snacks, and wine", [
      "Vintage handblown wine goblets", "L’Objet “Prism” green cocktail shaker", "Two-tier stainless steel server tower", "Nutcracker",
      "La Soufflerie glass carafe with head topper", "Vintage 1920s duck decanter", "FrischSchoggi",
    ], "https://assets.dmagstatic.com/wp-content/uploads/2026/11/serveware-snacks-wine-DHome-Winter-2026.webp")],
  },
  {
    id: "host", title: "For the Consummate Host", dek: "Placeholder: everything for a well-set table", layout: "still-life",
    groups: [
      g("host-kitchen", "Still life of kitchen tools beside a leather-bound Mastering the Art of French Cooking", [
        "Gold Footed Grater", "Silver Platter", "Bowl and Olive Wood Spoon", "Abbey-Horn Cow Horn Corkscrew", "Bamboo Salt and Pepper Set",
        "Laguiole Olive Wood Knives", "Leather-Bound Mastering The Art of French Cooking Book", "Horn Cheese Knives Set",
      ], "https://assets.dmagstatic.com/wp-content/uploads/2026/11/Julia-Child-Mastering-the-Art-of-French-Cooking-DHome-Winter-2026.webp"),
      g("host-table", "Still life of pears, martini glasses, and wine on a silver tray", [
        "“Borgo” Wine Holder", "Antique Silver Tray", "Pamplemousse “Ernest Creekd” martini glass", "Shelton Metal Shell Cordial",
        "Pair of Vintage Lazaro Nautilus Shell Candlesticks", "Jaymes Paper “Squiggle” Place Cards", "Teaspoon “Squiggle” Place Card Holder",
      ]),
    ],
  },
];
