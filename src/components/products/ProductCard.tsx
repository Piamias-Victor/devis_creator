"use client";

import { cn } from "@/lib/utils/cn";
import { Product } from "@/types";
import { formatPrice, formatPercentage, calculateMarge } from "@/lib/utils/devisUtils";
import { Package, TrendingUp, Plus } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  className?: string;
  compact?: boolean;
}

/**
 * Carte produit avec glassmorphism
 * Affichage détaillé + action sélection
 */
export function ProductCard({ product, onSelect, className, compact = false }: ProductCardProps) {
  const marge = calculateMarge(product.prixVente, product.prixAchat);
  
  // Couleur de la marge selon performance
  const getMargeColor = (margePourcent: number) => {
    if (margePourcent >= 30) return "text-green-600 dark:text-green-400";
    if (margePourcent >= 20) return "text-blue-600 dark:text-blue-400";
    if (margePourcent >= 10) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  // Badge catégorie
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "incontinence":
        return "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30";
      case "hygiène":
        return "bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30";
      case "soins":
        return "bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30";
      case "matériel médical":
        return "bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30";
      default:
        return "bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-500/30";
    }
  };

  if (compact) {
    return (
      <div 
        onClick={() => onSelect(product)}
        className={cn(
          "p-3 rounded-lg cursor-pointer transition-all duration-200",
          "bg-gray-100 backdrop-blur-sm border border-gray-200",
          "hover:bg-gray-200 hover:border-white/30 hover:shadow-lg",
          "supports-[backdrop-filter]:bg-gray-100",
          className
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {product.designation}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {product.code} • {formatPrice(product.prixVente)}
            </p>
          </div>
          <Plus className="w-4 h-4 text-blue-600 dark:text-blue-400 ml-2 flex-shrink-0" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "p-6 rounded-xl transition-all duration-300 cursor-pointer",
      "bg-gray-100 backdrop-blur-md border border-gray-200",
      "hover:bg-white/15 hover:border-white/30 hover:shadow-xl",
      "hover:shadow-blue-500/10 hover:-translate-y-1",
      "supports-[backdrop-filter]:bg-gray-100",
      className
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={cn(
            "p-2 rounded-lg",
            "bg-gradient-to-br from-indigo-500/20 to-purple-600/20",
            "border border-gray100"
          )}>
            <Package className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
              {product.designation}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Code: <span className="font-mono">{product.code}</span>
            </p>
          </div>
        </div>

        <span className={cn(
          "px-3 py-1 rounded-full text-xs font-medium border",
          getCategoryColor(product.categorie)
        )}>
          {product.categorie}
        </span>
      </div>

      {/* Informations prix et marge */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Prix de vente</p>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {formatPrice(product.prixVente)}
          </p>
          <p className="text-xs text-gray-500">par {product.unite}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Marge</p>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-gray-500" />
            <span className={cn("font-semibold", getMargeColor(marge.margePourcent))}>
              {formatPercentage(marge.margePourcent)}
            </span>
          </div>
          <p className="text-xs text-gray-500">
            +{formatPrice(marge.margeEuros)}
          </p>
        </div>
      </div>

      {/* Informations complémentaires */}
      <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
        <span>TVA: {product.tva}%</span>
        <span>Colissage: {product.colissage}</span>
      </div>

      {/* Bouton d'action */}
      <button
        onClick={() => onSelect(product)}
        className={cn(
          "w-full flex items-center justify-center space-x-2 py-3 rounded-lg",
          "bg-blue-600 hover:bg-blue-700 text-white",
          "transition-all duration-200 font-medium",
          "shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30"
        )}
      >
        <Plus className="w-4 h-4" />
        <span>Ajouter au devis</span>
      </button>
    </div>
  );
}