"use client";

import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { motion } from "framer-motion";
import { ColorData } from "../lib/colorAnalysis";

interface ColorAnalysisProps {
  colorData: ColorData;
}

export default function ColorAnalysis({ colorData }: ColorAnalysisProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="p-6">
        <h3 className="text-xl font-bold mb-4">Análisis de Color</h3>

        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-24 h-24 rounded-full shadow-lg"
            style={{ backgroundColor: colorData.dominantColor }}
          />

          <div className="flex-1 space-y-2">
            <div>
              <span className="text-sm text-muted-foreground">Matiz (Hue)</span>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 rounded-full" />
                <Badge>{colorData.hue}°</Badge>
              </div>
            </div>

            <div>
              <span className="text-sm text-muted-foreground">Saturación</span>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gradient-to-r from-gray-300 to-blue-500 rounded-full" />
                <Badge>{colorData.saturation}%</Badge>
              </div>
            </div>

            <div>
              <span className="text-sm text-muted-foreground">Luminosidad</span>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gradient-to-r from-black via-gray-500 to-white rounded-full" />
                <Badge>{colorData.lightness}%</Badge>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
