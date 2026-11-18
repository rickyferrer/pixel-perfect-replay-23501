import { describe, expect, it } from "vitest";
import { sections, groupByImage, type Product } from "@/data/gifts";
import { createStructuredData, priceNumber, isBuyUrl } from "@/data/gift-seo";

describe("Clean by category data", () => {
  it("preserves the selected rows and excludes Al Biernat's", () => {
    expect(sections.map((s) => s.groups.reduce((n, g) => n + g.products.length, 0))).toEqual([7, 6, 6, 7, 12, 5, 10]);
    expect(sections.flatMap((s) => s.groups.flatMap((g) => g.products)).some((p) => p.vendor.trim() === "Al Biernat's")).toBe(false);
  });
  it("uses the five sponsored selections in the sheet", () => {
    expect(sections.flatMap((s) => s.groups.flatMap((g) => g.products)).filter((p) => p.sponsored).map((p) => p.vendor)).toEqual(["Sunsoak", "The Do Cut & Color", "Canyon Ranch Wellness ", "Uncle Julio's ", "Netflix House"]);
  });
  it("preserves supplied names, vendors and price wording", () => {
    const products = sections.flatMap((s) => s.groups.flatMap((g) => g.products));
    expect(products.find((p) => p.name === "Pamplemousse “Ernest Creekd”")?.vendor).toBe("Martini Glass Garde");
    expect(products.find((p) => p.name === "Laguiole Olive Wood Knives")?.price).toBe("$420 for Six");
  });
  it("groups shared images once in first appearance order", () => {
    const base: Product = { name: "One", vendor: "Vendor", price: "$1", image: "photo-a", buyUrl: "", sponsored: false, sponsorBlurb: "" };
    expect(groupByImage([base, { ...base, name: "Two", image: "photo-b" }, { ...base, name: "Three" }], "sample").map((g) => g.products.map((p) => p.name))).toEqual([["One", "Three"], ["Two"]]);
  });
});

describe("Structured offers", () => {
  it("uses AggregateOffer lowPrice for From $140", () => {
    const items = createStructuredData().mainEntity.flatMap((s) => s.itemListElement);
    expect(items.find((i) => i.item.name === "Noritake Hoshikage place setting")?.item.offers).toMatchObject({ "@type": "AggregateOffer", lowPrice: 140, priceCurrency: "USD" });
  });
  it("uses 90 for $90 for four and retains the full description", () => {
    const item = createStructuredData().mainEntity.flatMap((s) => s.itemListElement).find((i) => i.item.name === "Georg Jensen stainless steel wine coasters")?.item;
    expect(item?.offers).toMatchObject({ "@type": "Offer", price: 90 });
    expect(item?.description).toContain("$90 for four");
  });
  it("uses 9995 for $9,995 for set", () => { expect(priceNumber("$9,995 for set")).toBe(9995); });
  it("excludes products without numeric prices or buy URLs", () => {
    const items = createStructuredData().mainEntity.flatMap((s) => s.itemListElement);
    expect(items.some((i) => i.item.name === "Bocci “14P” portable lamp")).toBe(false);
    expect(items.some((i) => i.item.name === "* WAITING ON ASSETS*")).toBe(false);
    expect(items).toHaveLength(52);
  });
  it("does not treat in-store text as a buy URL", () => { expect(isBuyUrl("In store only")).toBe(false); });
});