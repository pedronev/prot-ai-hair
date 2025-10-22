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
  const resized = tf.image.resizeBilinear(tensor, [500, 500]);
  const normalized = resized.div(255.0);
  const pixels = (await normalized.array()) as number[][][];

  const height = pixels.length;
  const width = pixels[0].length;

  // Analizar solo el tercio medio vertical donde está el cabello principal
  const hairRows = {
    start: Math.floor(height * 0.25),
    end: Math.floor(height * 0.55),
  };
  const hairCols = {
    start: Math.floor(width * 0.25),
    end: Math.floor(width * 0.75),
  };

  const hairPixels: number[][] = [];

  for (let i = hairRows.start; i < hairRows.end; i++) {
    for (let j = hairCols.start; j < hairCols.end; j++) {
      const [r, g, b] = pixels[i][j];

      const brightness = (r + g + b) / 3;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const saturation = max - min;

      // Excluir fondos muy claros
      if (brightness > 0.9 && saturation < 0.1) continue;

      // Excluir ropa oscura (negro/azul marino)
      if (brightness < 0.2) continue;

      // Excluir piel clara
      const isLightSkin =
        brightness > 0.65 && r > g && g > b && saturation < 0.2;
      if (isLightSkin) continue;

      hairPixels.push([r, g, b]);
    }
  }

  if (hairPixels.length < 50) {
    throw new Error("No se pudo detectar el cabello");
  }

  // Ordenar por brillo y tomar el rango medio (evitar sombras y brillos)
  const sorted = hairPixels
    .map((p) => ({ rgb: p, brightness: (p[0] + p[1] + p[2]) / 3 }))
    .sort((a, b) => a.brightness - b.brightness);

  const start = Math.floor(sorted.length * 0.3);
  const end = Math.floor(sorted.length * 0.7);
  const corePixels = sorted.slice(start, end).map((p) => p.rgb);

  const avgR = corePixels.reduce((sum, p) => sum + p[0], 0) / corePixels.length;
  const avgG = corePixels.reduce((sum, p) => sum + p[1], 0) / corePixels.length;
  const avgB = corePixels.reduce((sum, p) => sum + p[2], 0) / corePixels.length;

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
