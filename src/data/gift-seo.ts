import { sections, type Section } from "./gifts";

// Temporary self-referencing origin until the guide has a published URL.
export const siteUrl = "https://id-preview--1417c4ca-c984-45f2-848d-fadcd59ae2f0.lovable.app/";
export const guideDescription = "Considered holiday gifts for everyone on your list, from everyday upgrades to little luxuries and gifts for the consummate host.";
export const shareImage = sections[0]?.groups[0]?.image;
export const isBuyUrl = (url: string) => /^https?:\/\//i.test(url);
export function priceNumber(price: string): number | null {
  const match = price.match(/\$\s*([\d,]+(?:\.\d+)?)/);
  const number = match?.[1];
  return number ? Number(number.replaceAll(",", "")) : null;
}

// Conservative known brand prefixes; never infer a brand from an ordinary noun.
const brandPrefixes = ["Trudon", "Skultuna", "Printworks", "Santa Maria Novella", "Georg Jensen", "Bur Bur", "Costa Brazil", "Breda", "Adlan", "Noritake", "Ha Ko", "Larder", "Abbeyhorn", "Bocci", "Pamplemousse", "Shelton", "Laguiole", "L’Objet", "Kaweco"];
export function createStructuredData(data: Section[] = sections) {
  return {
    "@context": "https://schema.org", "@type": "CollectionPage", name: "Holiday Gift Guide", description: guideDescription, url: siteUrl,
    mainEntity: data.map((section) => {
      const products = section.groups.flatMap((group) => group.products.map((product) => ({ product, image: group.image })))
        .filter(({ product }) => isBuyUrl(product.buyUrl) && priceNumber(product.price) !== null);
      return {
        "@type": "ItemList", name: section.title, description: section.dek, numberOfItems: products.length,
        itemListElement: products.map(({ product, image }, i) => {
          const brand = brandPrefixes.find((prefix) => product.name.startsWith(`${prefix} `));
          const from = /^from\b/i.test(product.price);
          return { "@type": "ListItem", position: i + 1, item: {
            "@type": "Product", name: product.name, image: new URL(image, siteUrl).href, url: product.buyUrl,
            ...(brand ? { brand: { "@type": "Brand", name: brand } } : {}),
            description: [product.price, product.note, product.sponsorBlurb].filter(Boolean).join(". "),
            offers: { "@type": from ? "AggregateOffer" : "Offer", [from ? "lowPrice" : "price"]: priceNumber(product.price), priceCurrency: "USD", url: product.buyUrl, seller: { "@type": "Organization", name: product.vendor } },
          } };
        }),
      };
    }),
  };
}
export const structuredData = createStructuredData();
export const jsonLd = JSON.stringify(structuredData).replaceAll("<", "\\u003c");
export function createFeed() {
  return { name: "Holiday Gift Guide", url: siteUrl, sections: sections.map((section) => ({ ...section,
    groups: section.groups.map((group) => ({ ...group, products: group.products.map((p) => ({ ...p, priceNumber: priceNumber(p.price), image: new URL(group.image, siteUrl).href })) })),
  })) };
}