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
    const hueDiff = Math.min(
      Math.abs(colorData.hue - product.hue),
      360 - Math.abs(colorData.hue - product.hue)
    );
    const satDiff = Math.abs(colorData.saturation - product.saturation);
    const lightDiff = Math.abs(colorData.lightness - product.lightness);

    const isDark = colorData.lightness < 35;
    const isReddish = product.hue >= 0 && product.hue <= 20;

    let hueWeight = 0.35;
    let satWeight = 0.25;
    let lightWeight = 0.4;

    if (isDark) {
      lightWeight = 0.5;
      hueWeight = 0.25;
      satWeight = 0.25;
    }

    if (isReddish && colorData.saturation < 30) {
      satWeight = 0.4;
      hueWeight = 0.4;
      lightWeight = 0.2;
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

  return matches.sort((a, b) => b.similarity - a.similarity).slice(0, topN);
}
