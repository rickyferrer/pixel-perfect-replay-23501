export type SectionId = "elevate" | "tastemaker" | "using" | "bonvivant";

export interface Product {
  name: string;
  /** Optional rich name, e.g. for italic book titles. */
  nameParts?: { text: string; italic?: boolean }[];
  vendor: string;
  price: string;
  /** Empty string hides the buy button. */
  buyUrl: string;
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

const PH = "/placeholder.svg";
type Row = [string, string, string, Partial<Product>?];
const p = ([name, vendor, price, extra]: Row): Product => ({ name, vendor, price, buyUrl: "#", ...extra });
const g = (id: string, alt: string, rows: Row[]): ImageGroup => ({ id, image: PH, alt, products: rows.map(p) });

export const sections: Section[] = [
  {
    id: "elevate", title: "Elevate the Everyday", dek: "Elegant upgrades for every facet of life", layout: "grid",
    groups: [
      g("card-holder", 'Jan Barboglio "El Sorteo" card holder', [['Jan Barboglio "El Sorteo" card holder', "St. Michael's Woman's Exchange", "$432"]]),
      g("pet-shampoo", "Santa Maria Novella shampoo for pets", [["Santa Maria Novella shampoo for pets", "The Conservatory", "$30"]]),
      g("biscuit-tray", "Cathead biscuit cutter resting on a small round pewter tray", [["Cathead biscuit cutter", "The Standard McKinney", "$38"], ["Small round Match pewter tray", "KD Biel Design District", "$399"]]),
      g("bain-marie", "Vintage 1880s copper bain marie set", [["Vintage 1880s Barron & Wilson copper bain marie", "Weston Table", "$9,995 for set"]]),
      g("honey", "Jar of tupelo honey with a horn honey dipper", [["Larder tupelo honey", "KD Biel Design District", "$45"], ["Abbeyhorn honey dipper", "KD Biel Design District", "$58"]]),
      g("sugar", "French sugar dish with tongs and flower-shaped sugar cubes", [["French sugar dish, tongs, and flower sugar cubes", "The Standard McKinney", "From $8"]]),
      g("diffuser", 'Adlan "Crowd Pleaser" diffuser', [['Adlan "Crowd Pleaser" diffuser', "The Conservatory", "$220"]]),
      g("dominoes", "Wood and brass dominoes set", [["Wood and brass dominoes set", "Brunello Cucinelli", "$9,000"]]),
      g("napkin", "Cocktail napkin holder", [["Cocktail napkin holder", "Nicholson-Hardie", "$105"]]),
      g("garden", "Bronze hand shovel beside a gardening pot", [["PKS bronze hand shovel", "KD Biel Knox", "$68"], ["Skultuna gardening pot", "KD Biel Design District", "$110"]]),
      g("books", "Leather-bound book adorned with sterling silver book jewels", [
        ["The Grapes of Wrath leather-bound edition", "Weston Table", "$115", { nameParts: [{ text: "The Grapes of Wrath", italic: true }, { text: " leather-bound edition" }] }],
        ["Carma sterling silver book jewels", "Bird's Bookstore", "From $336"],
      ]),
      g("pitcher", "Glass horse pitcher with matching tumblers", [["Artel glassware horse pitcher and tumblers", "Blue Print", "From $200"]]),
    ],
  },
  {
    id: "tastemaker", title: "For the Tastemaker", dek: "Fashion-forward accessories designed to stand out", layout: "still-life",
    groups: [g("tastemaker-still-life", "Still life of accessories for the tastemaker arranged on velvet", [
      ["Iridescent ribbed socks", "Shop Swoon", "$48"],
      ['Costa Brazil "Aroma" eau de parfum', "The Conservatory", "$198"],
      ["Georg Jensen stainless steel wine coasters", "The Conservatory", "$90 for four"],
      ["Vintage silver tray", "Nick Brock & Company", "$165"],
      ['24K-gold-plated "Scarab" cow tie', "La Double J", "$420"],
      ['Bur Bur "The Mini Mermaid" detangling brush', "Commerce Goods & Supply", "$58"],
      ['Breda "Pulse" tandem watch', "Commerce Goods & Supply", "$250"],
      ["Pewter hip flask", "Lela Rose", "$190"],
    ])],
  },
  {
    id: "using", title: "Gifts Worth Using", dek: "Utilitarian essentials, beautifully reimagined", layout: "grid",
    groups: [
      g("vessel", "Chase Gamblin vessel", [["Chase Gamblin vessel", "Twelve Thirty Four Studio", "$2,500"]]),
      g("lamp", 'Bocci "14P" portable lamp', [['Bocci "14P" portable lamp', "Scott + Cooner", "$350"]]),
      g("clutch-tray", "Leather dumpling clutch on an octagonal pewter tray", [['"Dumpling" clutch', "Leatherology", "$160"], ["Match pewter octagonal tray", "KD Biel Design District", "$368"]]),
      g("mortar", "Porcelain mortar and pestle", [["John Julian porcelain mortar and pestle", "KD Biel Knox", "$450"]]),
      g("umbrella", "Mini umbrella with a horse-head handle", [["Mini horse umbrella", "Holos House", "$65"]]),
      g("place-setting", "Noritake Hoshikage place setting", [["Noritake Hoshikage place setting", "Garde", "From $140"]]),
      g("chiller", "Hand-crafted wine chiller and vase", [["Mercurio hand-crafted wine chiller and vase", "Tlazo Home", "$355"]]),
      g("fire-blanket", "Printworks fire blanket", [["Printworks fire blanket", "All Good Things", "$75"]]),
      g("boots", "Boot jack beside a pair of cowboy boots", [["Lela Rose x Berkely Beauchot boot jack", "Lela Rose", "$420"], ['"Jamie" boots', "Tecovas", "$545"]]),
      g("vintage-dominoes", "Circa-1970s dominoes", [["Circa-1970s dominoes", "Sputnik Modern", "$3,200"]]),
      g("incense", "Ha Ko paper incense", [["Ha Ko paper incense", "Shop Swoon", "$56"]]),
      g("soap", 'Trudon 1643 "Carmen" hand soap', [['Trudon 1643 "Carmen" hand soap', "Forty Five Ten", "$114"]]),
    ],
  },
  {
    id: "bonvivant", title: "For the Bon Vivant", dek: "Serveware, snacks, and other tasteful indulgences", layout: "still-life",
    groups: [g("bonvivant-still-life", "Still life of serveware and treats for the bon vivant arranged on velvet", [
      ["Vintage handblown wine goblets", "Grange Hall", "$750 for two"],
      ['L\'Objet "Prism" green cocktail shaker', "Blue Print", "$200"],
      ["Two-tier stainless steel server tower", "Crate & Barrel", "$130"],
      ["Nutcracker", "Holos House", "$10"],
      ["La Soufflerie glass carafe with head topper", "KD Biel Knox", "From $52"],
      ["Vintage 1920s duck decanter", "Weston Table", "$5,395"],
      ["FrischSchoggi", "Läderach", "From $25", { note: "Läderach's array of barks, available at the Swiss chocolatier's NorthPark outpost, makes a gift for any gourmand." }],
    ])],
  },
];
