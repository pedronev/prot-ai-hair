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

      <div className="grid md:grid-cols-3 gap-4">
        {matches.map((match, index) => (
          <motion.div
            key={match.product.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + index * 0.1 }}
          >
            <Card className="overflow-hidden hover:shadow-xl transition-shadow">
              {index === 0 && (
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-center py-2 font-bold">
                  Mejor Coincidencia
                </div>
              )}

              <div className="relative h-64 bg-gray-100">
                <Image
                  src={match.product.image}
                  alt={match.product.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <Badge variant="outline" className="mb-2">
                    {match.product.code}
                  </Badge>
                  <h4 className="font-bold text-lg">{match.product.name}</h4>
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full border-2"
                    style={{ backgroundColor: match.product.colorHex }}
                  />
                  <div className="flex-1">
                    <div className="text-sm text-muted-foreground">
                      Compatibilidad
                    </div>
                    <div className="font-bold text-green-600">
                      {match.similarity.toFixed(0)}%
                    </div>
                  </div>
                </div>

                <Button className="w-full">Ver Producto</Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
