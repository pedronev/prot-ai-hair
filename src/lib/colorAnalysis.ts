import * as tf from "@tensorflow/tfjs";

export interface ColorData {
  hue: number;
  saturation: number;
  lightness: number;
  dominantColor: string;
}

export async function analyzeImageColor(
  imageElement: HTMLImageElement
): Promise<ColorData> {
  const tensor = tf.browser.fromPixels(imageElement);
  const resized = tf.image.resizeBilinear(tensor, [224, 224]);
  const normalized = resized.div(255.0);

  const pixels = (await normalized.array()) as number[][][];

  let totalR = 0,
    totalG = 0,
    totalB = 0;
  let pixelCount = 0;

  for (let i = 0; i < pixels.length; i++) {
    for (let j = 0; j < pixels[i].length; j++) {
      totalR += pixels[i][j][0];
      totalG += pixels[i][j][1];
      totalB += pixels[i][j][2];
      pixelCount++;
    }
  }

  const avgR = totalR / pixelCount;
  const avgG = totalG / pixelCount;
  const avgB = totalB / pixelCount;

  const hsl = rgbToHsl(avgR, avgG, avgB);

  tensor.dispose();
  resized.dispose();
  normalized.dispose();

  return {
    hue: hsl.h,
    saturation: hsl.s,
    lightness: hsl.l,
    dominantColor: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
  };
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}
