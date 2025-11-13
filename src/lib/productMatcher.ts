import products from "../data/products.json";
import { ColorData } from "./colorAnalysis";

export interface Product {
  id: string;
  name: string;
  code: string;
  image: string;
  colorHex: string;
  hue: number;
  saturation: number;
  lightness: number;
}

export interface MatchResult {
  product: Product;
  similarity: number;
}

export function findBestMatches(
  colorData: ColorData,
  topN: number = 3
): MatchResult[] {
  const matches = products.map((product) => {
    let hueDiff = Math.min(
      Math.abs(colorData.hue - product.hue),
      360 - Math.abs(colorData.hue - product.hue)
    );
    const satDiff = Math.abs(colorData.saturation - product.saturation);
    const lightDiff = Math.abs(colorData.lightness - product.lightness);

    const isVeryDark = colorData.lightness < 30;
    const isDark = colorData.lightness < 40;
    const isReddish =
      (colorData.hue >= 340 || colorData.hue <= 25) &&
      colorData.saturation > 15;
    const productIsRed =
      (product.hue >= 340 || product.hue <= 25) && product.saturation > 30;

    let hueWeight = 0.3;
    let satWeight = 0.3;
    let lightWeight = 0.4;

    if (isReddish && productIsRed) {
      hueWeight = 0.35;
      satWeight = 0.35;
      lightWeight = 0.3;
    } else if (isVeryDark) {
      lightWeight = 0.6;
      hueWeight = 0.15;
      satWeight = 0.25;

      if (productIsRed && !isReddish) {
        return { product: product as Product, similarity: 0 };
      }
    } else if (isDark) {
      lightWeight = 0.5;
      hueWeight = 0.25;
      satWeight = 0.25;

      if (productIsRed && !isReddish) {
        hueDiff *= 2.5;
      }
    }

    if (!isReddish && productIsRed && colorData.saturation < 20) {
      return { product: product as Product, similarity: 0 };
    }

    const normalizedHueDiff = hueDiff / 180;
    const normalizedSatDiff = satDiff / 100;
    const normalizedLightDiff = lightDiff / 100;

    const distance =
      normalizedHueDiff * hueWeight * 100 +
      normalizedSatDiff * satWeight * 100 +
      normalizedLightDiff * lightWeight * 100;

    const similarity = Math.max(0, 100 - distance);

    return { product: product as Product, similarity };
  });

  return matches
    .filter((m) => m.similarity > 0)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topN);
}
