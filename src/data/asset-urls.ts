// Keep public media tied to the guide host when its markup is embedded elsewhere.
export const assetOrigin = "https://gift-guide.dmagazine.com";

export function absoluteAssetUrl(path: string): string {
  return new URL(path, `${assetOrigin}/`).href;
}