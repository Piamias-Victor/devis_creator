"use client";

import { cn } from "@/lib/utils/cn";
import { DevisCalculations } from "@/types";
import { getMargeColorClass, formatPourcent, formatEuros } from "@/lib/utils/calculUtils";
import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

interface MargeIndicatorsProps {
  calculations: DevisCalculations;
  className?: string;
}

/**
 * Barre horizontale d'indicateurs de marge
 * Rouge < 8% | Jaune 8-12% | Vert > 12%
 */
export function MargeIndicators({ calculations, className }: MargeIndicatorsProps) {
  const { margeGlobalePourcent, margeGlobaleEuros, nombreLignes } = calculations;
  
  if (nombreLignes === 0) {
    return (
      <div className={cn(
        "p-4 rounded-lg border border-gray-200 bg-gray-100/5 backdrop-blur-sm text-center",
        className
      )}>
        <p className="text-gray-500 dark:text-gray-400">
          Ajoutez des produits pour voir l'analyse de marge
        </p>
      </div>
    );
  }

  const margeStyle = getMargeColorClass(margeGlobalePourcent);
  
  const getIcon = () => {
    if (margeGlobalePourcent < 8) return AlertTriangle;
    if (margeGlobalePourcent < 12) return TrendingDown;
    return TrendingUp;
  };
  
  const Icon = getIcon();
  const progressWidth = Math.min((margeGlobalePourcent / 25) * 100, 100);

  return (
    <div className={cn(
      "p-6 rounded-xl border border-gray-200 bg-white/5 backdrop-blur-md",
      margeStyle.bg,
      className
    )}>
      <div className="flex items-center justify-between">
        {/* Info principale */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Icon className={cn("w-5 h-5", margeStyle.text)} />
            <h3 className={cn("text-lg font-semibold", margeStyle.text)}>
              Marge {margeStyle.label}
            </h3>
          </div>
          
          <div className="flex items-center space-x-6">
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400 block">Taux global</span>
              <span className={cn("text-2xl font-bold", margeStyle.text)}>
                {formatPourcent(margeGlobalePourcent)}
              </span>
            </div>
            
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400 block">Marge totale</span>
              <span className={cn("text-xl font-semibold", margeStyle.text)}>
                {formatEuros(margeGlobaleEuros)}
              </span>
            </div>
          </div>
        </div>

        {/* Seuils */}
        <div className="flex items-center space-x-4 text-xs">
          <div className="text-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-1"></div>
            <span className="text-gray-500">8%</span>
          </div>
          <div className="text-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto mb-1"></div>
            <span className="text-gray-500">8-12%</span>
          </div>
          <div className="text-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1"></div>
            <span className="text-gray-500">12%</span>
          </div>
        </div>
      </div>

      {/* Barre progression */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Critique</span>
          <span>Objectif: 15%</span>
          <span>Excellence</span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div 
            className={cn(
              "h-3 rounded-full transition-all duration-500",
              margeGlobalePourcent < 8 ? "bg-red-500" :
              margeGlobalePourcent < 12 ? "bg-yellow-500" : "bg-green-500"
            )}
            style={{ width: `${progressWidth}%` }}
          />
        </div>
      </div>
    </div>
  );
}