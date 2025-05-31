"use client";

import { cn } from "@/lib/utils/cn";
import { formatPrice, formatPercentage } from "@/lib/utils/devisUtils";
import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

interface MargeIndicatorProps {
  margeEuros: number;
  margePourcent: number;
  className?: string;
  showDetails?: boolean;
}

/**
 * Indicateur visuel de marge avec couleurs et graphique
 * Affichage % + € + barre de progression colorée
 */
export function MargeIndicator({ 
  margeEuros, 
  margePourcent, 
  className,
  showDetails = true 
}: MargeIndicatorProps) {
  
  // Déterminer couleur selon performance
  const getMargeColor = () => {
    if (margePourcent < 0) return {
      bg: "bg-red-500",
      text: "text-red-600 dark:text-red-400",
      border: "border-red-500/30",
      icon: AlertTriangle
    };
    if (margePourcent < 10) return {
      bg: "bg-red-400", 
      text: "text-red-600 dark:text-red-400",
      border: "border-red-500/30",
      icon: TrendingDown
    };
    if (margePourcent < 20) return {
      bg: "bg-yellow-500",
      text: "text-yellow-600 dark:text-yellow-400", 
      border: "border-yellow-500/30",
      icon: TrendingUp
    };
    if (margePourcent < 35) return {
      bg: "bg-blue-500",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-500/30", 
      icon: TrendingUp
    };
    return {
      bg: "bg-green-500",
      text: "text-green-600 dark:text-green-400",
      border: "border-green-500/30",
      icon: TrendingUp
    };
  };

  const colors = getMargeColor();
  const Icon = colors.icon;
  
  // Largeur de la barre (max 100%)
  const barWidth = Math.min(Math.abs(margePourcent) * 2, 100);
  
  // Niveau de performance
  const getPerformanceLabel = () => {
    if (margePourcent < 0) return "Critique";
    if (margePourcent < 10) return "Faible";
    if (margePourcent < 20) return "Correcte";
    if (margePourcent < 35) return "Bonne";
    return "Excellente";
  };

  return (
    <div className={cn(
      "p-4 rounded-lg border",
      "bg-gray-100/5 backdrop-blur-sm",
      colors.border,
      className
    )}>
      {/* Header avec icône et titre */}
      <div className="flex items-center space-x-2 mb-3">
        <Icon className={cn("w-4 h-4", colors.text)} />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Marge {getPerformanceLabel()}
        </span>
      </div>

      {/* Valeurs principales */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className={cn("text-lg font-bold", colors.text)}>
            {formatPercentage(margePourcent)}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {formatPrice(margeEuros)}
          </span>
        </div>

        {/* Barre de progression */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className={cn(
              "h-2 rounded-full transition-all duration-500",
              colors.bg
            )}
            style={{ width: `${barWidth}%` }}
          />
        </div>

        {/* Détails supplémentaires */}
        {showDetails && (
          <div className="mt-3 pt-3 border-t border-gray-100/10">
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400">
              <div>
                <span className="block">Objectif: 20%</span>
                <span className="block">Seuil: 15%</span>
              </div>
              <div className="text-right">
                <span className="block">
                  {margePourcent >= 10 ? "✅ Atteint" : 
                   margePourcent >= 8 ? "⚠️ Proche" : "❌ Insuffisant"}
                </span>
                <span className="block">
                  {margePourcent >= 10 ? "✅ Seuil OK" : "❌ Sous seuil"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}