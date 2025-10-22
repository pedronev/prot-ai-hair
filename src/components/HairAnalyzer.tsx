"use client";

import { useState } from "react";
import { Progress } from "../components/ui/progress";
import ImageCapture from "./ImageCapture";
import ColorAnalysis from "./ColorAnalysis";
import ProductRecommendations from "./ProductRecommendations";
import { analyzeImageColor, ColorData } from "../lib/colorAnalysis";
import { findBestMatches, MatchResult } from "../lib/productMatcher";

export default function HairAnalyzer() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [colorData, setColorData] = useState<ColorData | null>(null);
  const [matches, setMatches] = useState<MatchResult[]>([]);

  const handleImageCapture = async (image: HTMLImageElement) => {
    setIsAnalyzing(true);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 90));
    }, 100);

    try {
      const color = await analyzeImageColor(image);
      const bestMatches = findBestMatches(color, 22); // Todas las fotos

      setColorData(color);
      setMatches(bestMatches);
      setProgress(100);

      setTimeout(() => {
        setIsAnalyzing(false);
      }, 500);
    } catch (error) {
      console.error("Error analyzing image:", error);
      setIsAnalyzing(false);
    } finally {
      clearInterval(progressInterval);
    }
  };

  return (
    <div className="space-y-6">
      <ImageCapture onImageCapture={handleImageCapture} />

      {isAnalyzing && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Analizando tu cabello...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>
      )}

      {colorData && <ColorAnalysis colorData={colorData} />}
      {matches.length > 0 && <ProductRecommendations matches={matches} />}
    </div>
  );
}
