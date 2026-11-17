import { render, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AdSlot } from "@/components/AdSlot";

afterEach(() => {
  cleanup();
  delete window.googletag;
  delete (window as any).__giftGuideGptReady;
  document.querySelectorAll('script[src*="/tag/js/gpt.js"]').forEach((script) => script.remove());
});

describe("Guide GAM slots", () => {
  it("requests the page's network with only a 970x250 creative", () => {
    const defineSlot = vi.fn(() => ({ addService: vi.fn() }));
    const display = vi.fn();
    window.googletag = {
      cmd: [],
      pubads: () => ({ collapseEmptyDivs: vi.fn() }),
      enableServices: vi.fn(),
      defineSlot,
      display,
      destroySlots: vi.fn(),
    };
    render(<AdSlot id="gift-guide-ad-test" />);
    window.googletag.cmd.forEach((command) => command());
    expect(defineSlot).toHaveBeenCalledWith("/23367196308/MissEllie_horizontal", [970, 250], "gift-guide-ad-test");
    expect(display).toHaveBeenCalledWith("gift-guide-ad-test");
  });
});