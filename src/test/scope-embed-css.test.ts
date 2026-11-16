import { describe, expect, it } from "vitest";
import { scopeEmbedCss, scopeSelector } from "../../scripts/scope-embed-css";

describe("embed stylesheet scoping", () => {
  it("prefixes ordinary selectors with the embed root", () => {
    expect(scopeSelector(".text-lg")).toBe("#gift-guide-root .text-lg");
    expect(scopeSelector("h3")).toBe("#gift-guide-root h3");
  });
  it("maps page-level selectors onto the embed root", () => {
    expect(scopeSelector(":root")).toBe("#gift-guide-root");
    expect(scopeSelector("body")).toBe("#gift-guide-root");
    expect(scopeSelector(".has-js .reveal")).toBe(".has-js #gift-guide-root .reveal");
  });
  it("removes cascade layers so host theme rules cannot win", () => {
    const out = scopeEmbedCss("@layer theme, base;@layer utilities{.p-4{padding:1rem}}");
    expect(out).not.toContain("@layer");
    expect(out).toContain("#gift-guide-root .p-4{padding:16px}");
  });
  it("leaves keyframe steps untouched", () => {
    expect(scopeEmbedCss("@keyframes f{from{opacity:0}to{opacity:1}}")).toContain("from{opacity:0}");
  });
});

describe("host theme reset", () => {
  it("makes headings inherit color and size instead of the host theme", () => {
    const out = scopeEmbedCss(".x{color:red}");
    expect(out).toContain("#gift-guide-root :is(h1,h2,h3");
    expect(out).toContain("color:inherit");
  });
});
