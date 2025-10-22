"use client";

import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";
import { MatchResult } from "../lib/productMatcher";
import { Sparkles } from "lucide-react";
import Image from "next/image";

interface ProductRecommendationsProps {
  matches: MatchResult[];
}

export default function ProductRecommendations({
  matches,
}: ProductRecommendationsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2">
        <Sparkles className="w-6 h-6 text-yellow-500" />
        <h3 className="text-2xl font-bold">Tus Mejores Opciones</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {matches.map((match, index) => (
          <motion.div
            key={match.product.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + index * 0.05 }}
          >
            <Card className="overflow-hidden hover:shadow-xl transition-shadow">
              {index === 0 && (
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-center py-2 font-bold text-sm">
                  Mejor Coincidencia
                </div>
              )}

              <div className="relative h-48 bg-gray-100">
                <Image
                  src={match.product.image}
                  alt={match.product.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-3 space-y-2">
                <div>
                  <Badge variant="outline" className="mb-1 text-xs">
                    {match.product.code}
                  </Badge>
                  <h4 className="font-bold text-sm line-clamp-2">
                    {match.product.name}
                  </h4>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      H: {match.product.hue}°
                    </span>
                    <span className="text-muted-foreground">
                      S: {match.product.saturation}%
                    </span>
                    <span className="text-muted-foreground">
                      L: {match.product.lightness}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full border-2 shrink-0"
                    style={{ backgroundColor: match.product.colorHex }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-muted-foreground">
                      Compatibilidad
                    </div>
                    <div className="font-bold text-green-600 text-sm">
                      {match.similarity.toFixed(0)}%
                    </div>
                  </div>
                </div>

                <Button className="w-full" size="sm">
                  Ver Producto
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
