"use client";

import { cn } from "@/lib/utils/cn";
import { ProductCreateInput } from "@/types";
import { Package } from "lucide-react";

interface ProductPreviewProps {
  formData: {
    code: string;
    designation: string;
    prixAchat: number;
    prixVente: number;
    tva: number;
    colissage: number;
  };
}

/**
 * Prévisualisation produit avec calculs automatiques
 * Composant présentation pur < 60 lignes
 */
export function ProductPreview({ formData }: ProductPreviewProps) {
  // Calculs automatiques
  const margeEuros = (formData.prixVente || 0) - (formData.prixAchat || 0);
  const margePourcent = formData.prixAchat > 0 
    ? (margeEuros / formData.prixAchat) * 100 
    : 0;

  // Ne pas afficher si pas assez de données
  if (!formData.prixAchat || !formData.prixVente) {
    return null;
  }

  const getMargeColor = () => {
    if (margePourcent < 8) return "text-red-600 bg-red-50 border-red-200";
    if (margePourcent < 15) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-green-600 bg-green-50 border-green-200";
  };

  return (
    <div className={cn(
      "p-4 rounded-lg border-2 border-dashed",
      "bg-indigo-50 border-indigo-200"
    )}>
      <h4 className="font-medium text-indigo-900 mb-3 flex items-center space-x-2">
        <Package className="w-4 h-4" />
        <span>✨ Calculs automatiques</span>
      </h4>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Marge en euros */}
        <div className="text-center p-3 bg-white rounded-lg border border-indigo-200">
          <span className="text-indigo-700 text-sm block">Marge unitaire</span>
          <div className="font-bold text-indigo-900 text-lg">
            {margeEuros.toFixed(4)}€
          </div>
        </div>

        {/* Marge en pourcentage */}
        <div className={cn(
          "text-center p-3 rounded-lg border-2",
          getMargeColor()
        )}>
          <span className="text-sm block">Marge %</span>
          <div className="font-bold text-lg">
            {margePourcent.toFixed(1)}%
          </div>
          <div className="text-xs mt-1">
            {margePourcent < 8 ? "⚠️ Faible" : 
             margePourcent < 15 ? "👍 Correcte" : "🎯 Excellente"}
          </div>
        </div>
      </div>

      {/* Prix TTC indicatif */}
      <div className="mt-3 text-center text-sm text-indigo-700">
        💡 Prix TTC indicatif: <strong>
          {((formData.prixVente || 0) * (1 + (formData.tva || 20) / 100)).toFixed(2)}€
        </strong>
      </div>
    </div>
  );
}