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

    // Para tonos claros/rubios la luminosidad es crítica
    const isBlonde = colorData.lightness > 55;
    const hueWeight = isBlonde ? 0.25 : 0.35;
    const satWeight = isBlonde ? 0.15 : 0.25;
    const lightWeight = isBlonde ? 0.6 : 0.4;

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
