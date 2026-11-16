import { describe, expect, it } from "vitest";
import { absoluteAssetUrl } from "@/data/asset-urls";
import { sections } from "@/data/gifts";
import foundersRegular from "@/assets/founders-grotesk-regular.asset.json";

describe("WordPress asset addresses", () => {
  it("resolves relative assets against the public guide, not the embedding site", () => {
    expect(absoluteAssetUrl(foundersRegular.url)).toBe("https://gift-guide.dmagazine.com/__l5e/assets-v1/b28bb719-142a-441e-b62f-8613c1513932/founders-grotesk-regular.otf");
    expect(absoluteAssetUrl("/assets/guide.css")).toBe("https://gift-guide.dmagazine.com/assets/guide.css");
    expect(absoluteAssetUrl("/placeholder.svg")).toBe("https://gift-guide.dmagazine.com/placeholder.svg");
  });
  it("preserves the original absolute photo addresses", () => {
    const photo = "https://assets.dmagstatic.com/wp-content/uploads/2026/11/fashion-accessories-DHome-Winter-2026-VERT.webp";
    expect(absoluteAssetUrl(photo)).toBe(photo);
    expect(sections.flatMap((s) => s.groups).every((g) => g.image.startsWith("https://"))).toBe(true);
  });
});