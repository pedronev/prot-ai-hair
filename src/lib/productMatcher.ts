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

    // Ajustar pesos: lightness es más importante para tonos rubios
    const hueWeight = 0.3;
    const satWeight = 0.2;
    const lightWeight = 0.5; // Aumentado

    const distance =
      hueDiff * hueWeight + satDiff * satWeight + lightDiff * lightWeight;
    const similarity = Math.max(0, 100 - distance);

    return {
      product: product as Product,
      similarity,
    };
  });

  return matches.sort((a, b) => b.similarity - a.similarity).slice(0, topN);
}
