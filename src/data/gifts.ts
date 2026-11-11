export type SectionId = "elevate" | "tastemaker" | "using" | "bonvivant";

export interface Product {
  section: SectionId;
  name: string;
  /** Optional rich name, e.g. for italic book titles. Plain `name` is used for alt text. */
  nameParts?: { text: string; italic?: boolean }[];
  vendor: string;
  price: string;
  image: string;
  alt: string;
  link?: string;
  note?: string;
}

export interface Section {
  id: SectionId;
  title: string[];
  label: string;
  dek: string;
  layout: "grid" | "still-life";
  heroImage?: string;
  heroAlt?: string;
}

const PH = "/placeholder.svg";

export const sections: Section[] = [
  { id: "elevate", title: ["Elevate", "the", "Everyday"], label: "Elevate the Everyday", dek: "Elegant upgrades for every facet of life", layout: "grid" },
  { id: "tastemaker", title: ["For", "the", "Tastemaker"], label: "For the Tastemaker", dek: "Fashion-forward accessories designed to stand out", layout: "still-life", heroImage: PH, heroAlt: "Still life of accessories for the tastemaker arranged on velvet" },
  { id: "using", title: ["Gifts", "Worth", "Using"], label: "Gifts Worth Using", dek: "Utilitarian essentials, beautifully reimagined", layout: "grid" },
  { id: "bonvivant", title: ["For", "the", "Bon Vivant"], label: "For the Bon Vivant", dek: "Serveware, snacks, and other tasteful indulgences", layout: "still-life", heroImage: PH, heroAlt: "Still life of serveware and treats for the bon vivant arranged on velvet" },
];

type Row = [string, string, string, Partial<Product>?];
const make = (section: SectionId, rows: Row[]): Product[] =>
  rows.map(([name, vendor, price, extra]) => ({ section, name, vendor, price, image: PH, alt: name, ...extra }));

export const products: Product[] = [
  ...make("elevate", [
    ['Jan Barboglio "El Sorteo" card holder', "St. Michael's Woman's Exchange", "$432"],
    ["Santa Maria Novella shampoo for pets", "The Conservatory", "$30"],
    ["Cathead biscuit cutter", "The Standard McKinney", "$38"],
    ["Small round Match pewter tray", "KD Biel Design District", "$399"],
    ["Vintage 1880s Barron & Wilson copper bain marie", "Weston Table", "$9,995 for set"],
    ["Larder tupelo honey", "KD Biel Design District", "$45"],
    ["Abbeyhorn honey dipper", "KD Biel Design District", "$58"],
    ["French sugar dish, tongs, and flower sugar cubes", "The Standard McKinney", "From $8"],
    ['Adlan "Crowd Pleaser" diffuser', "The Conservatory", "$220"],
    ["Wood and brass dominoes set", "Brunello Cucinelli", "$9,000"],
    ["Cocktail napkin holder", "Nicholson-Hardie", "$105"],
    ["PKS bronze hand shovel", "KD Biel Knox", "$68"],
    ["Skultuna gardening pot", "KD Biel Design District", "$110"],
    ["The Grapes of Wrath leather-bound edition", "Weston Table", "$115", { nameParts: [{ text: "The Grapes of Wrath", italic: true }, { text: " leather-bound edition" }] }],
    ["Carma sterling silver book jewels", "Bird's Bookstore", "From $336"],
    ["Artel glassware horse pitcher and tumblers", "Blue Print", "From $200"],
  ]),
  ...make("tastemaker", [
    ["Iridescent ribbed socks", "Shop Swoon", "$48"],
    ['Costa Brazil "Aroma" eau de parfum', "The Conservatory", "$198"],
    ["Georg Jensen stainless steel wine coasters", "The Conservatory", "$90 for four"],
    ["Vintage silver tray", "Nick Brock & Company", "$165"],
    ['24K-gold-plated "Scarab" cow tie', "La Double J", "$420"],
    ['Bur Bur "The Mini Mermaid" detangling brush', "Commerce Goods & Supply", "$58"],
    ['Breda "Pulse" tandem watch', "Commerce Goods & Supply", "$250"],
    ["Pewter hip flask", "Lela Rose", "$190"],
  ]),
  ...make("using", [
    ["Chase Gamblin vessel", "Twelve Thirty Four Studio", "$2,500"],
    ['Bocci "14P" portable lamp', "Scott + Cooner", "$350"],
    ['"Dumpling" clutch', "Leatherology", "$160"],
    ["Match pewter octagonal tray", "KD Biel Design District", "$368"],
    ["John Julian porcelain mortar and pestle", "KD Biel Knox", "$450"],
    ["Mini horse umbrella", "Holos House", "$65"],
    ["Noritake Hoshikage place setting", "Garde", "From $140"],
    ["Mercurio hand-crafted wine chiller and vase", "Tlazo Home", "$355"],
    ["Printworks fire blanket", "All Good Things", "$75"],
    ["Lela Rose x Berkely Beauchot boot jack", "Lela Rose", "$420"],
    ['"Jamie" boots', "Tecovas", "$545"],
    ["Circa-1970s dominoes", "Sputnik Modern", "$3,200"],
    ["Ha Ko paper incense", "Shop Swoon", "$56"],
    ['Trudon 1643 "Carmen" hand soap', "Forty Five Ten", "$114"],
  ]),
  ...make("bonvivant", [
    ["Vintage handblown wine goblets", "Grange Hall", "$750 for two"],
    ['L\'Objet "Prism" green cocktail shaker', "Blue Print", "$200"],
    ["Two-tier stainless steel server tower", "Crate & Barrel", "$130"],
    ["Nutcracker", "Holos House", "$10"],
    ["La Soufflerie glass carafe with head topper", "KD Biel Knox", "From $52"],
    ["Vintage 1920s duck decanter", "Weston Table", "$5,395"],
    ["FrischSchoggi", "Läderach", "From $25", { note: "Läderach's array of barks, available at the Swiss chocolatier's NorthPark outpost, makes a gift for any gourmand." }],
  ]),
];
