"use client";

import { cn } from "@/lib/utils/cn";
import { DevisLine } from "@/types";
import { formatPrice, formatPercentage } from "@/lib/utils/devisUtils";
import { Calculator, TrendingUp, FileText } from "lucide-react";

interface DevisSidebarProps {
  lignes: DevisLine[];
  className?: string;
}

interface CalculatedTotals {
  totalHT: number;
  totalTVA: number;
  totalTTC: number;
  margeGlobale: number;
  margeGlobalePourcent: number;
  nombreLignes: number;
  quantiteTotale: number;
}

/**
 * Sidebar de calculs en temps réel
 * Résumé financier + marges + statistiques
 */
export function DevisSidebar({ lignes, className }: DevisSidebarProps) {
  
  // Calculs en temps réel
  const calculateTotals = (): CalculatedTotals => {
    const totalHT = lignes.reduce((sum, ligne) => {
      const ligneTotal = ligne.quantite * ligne.prixUnitaire * (1 - ligne.remise / 100);
      return sum + ligneTotal;
    }, 0);

    const totalTVA = lignes.reduce((sum, ligne) => {
      const ligneTotal = ligne.quantite * ligne.prixUnitaire * (1 - ligne.remise / 100);
      return sum + (ligneTotal * ligne.tva / 100);
    }, 0);

    const totalTTC = totalHT + totalTVA;
    
    // Calcul de la marge RÉELLE basée sur les prix d'achat
    const totalPrixAchat = lignes.reduce((sum, ligne) => {
      if (!ligne.prixAchat) return sum;
      return sum + ligne.prixAchat * ligne.quantite;
    }, 0);

    const margeGlobale = totalHT - totalPrixAchat;
    const margeGlobalePourcent = totalPrixAchat > 0 ? (margeGlobale / totalPrixAchat) * 100 : 0;
    
    const nombreLignes = lignes.length;
    const quantiteTotale = lignes.reduce((sum, ligne) => sum + ligne.quantite, 0);

    return {
      totalHT,
      totalTVA,
      totalTTC,
      margeGlobale,
      margeGlobalePourcent,
      nombreLignes,
      quantiteTotale
    };
  };

  const totals = calculateTotals();

  return (
    <div className={cn(
      "w-80 space-y-6",
      className
    )}>
      {/* Résumé financier */}
      <div className={cn(
        "p-6 rounded-xl border border-gray-200",
        "bg-gray-50 backdrop-blur-md"
      )}>
        <div className="flex items-center space-x-3 mb-4">
          <div className={cn(
            "p-2 rounded-lg",
            "bg-gradient-to-br from-green-200 to-emerald-200",
            "border border-gray-200"
          )}>
            <Calculator className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            Résumé financier
          </h3>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Total HT</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {formatPrice(totals.totalHT)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">TVA (20%)</span>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {formatPrice(totals.totalTVA)}
            </span>
          </div>
          
          <div className="border-t border-gray-200 pt-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900 dark:text-gray-100">Total TTC</span>
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {formatPrice(totals.totalTTC)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Analyse des marges */}
      <div className={cn(
        "p-6 rounded-xl border border-gray-200",
        "bg-gray-50 backdrop-blur-md"
      )}>
        <div className="flex items-center space-x-3 mb-4">
          <div className={cn(
            "p-2 rounded-lg",
            "bg-gradient-to-br from-blue-200 to-purple-200",
            "border border-gray-200"
          )}>
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            Analyse des marges
          </h3>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Marge globale</span>
            <span className="font-semibold text-green-600 dark:text-green-400">
              {formatPrice(totals.margeGlobale)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Taux de marge</span>
            <span className={cn(
              "font-semibold",
              totals.margeGlobalePourcent >= 15 ? "text-green-600 dark:text-green-400" : "text-orange-600 dark:text-orange-400"
            )}>
              {formatPercentage(totals.margeGlobalePourcent)}
            </span>
          </div>

          {/* Indicateur visuel de marge */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Marge faible</span>
              <span>Marge excellente</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  totals.margeGlobalePourcent >= 20 ? "bg-green-500" :
                  totals.margeGlobalePourcent >= 15 ? "bg-blue-500" :
                  totals.margeGlobalePourcent >= 10 ? "bg-yellow-500" : "bg-red-500"
                )}
                style={{ width: `${Math.min(totals.margeGlobalePourcent * 2, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tips si devis vide */}
      {totals.nombreLignes === 0 && (
        <div className={cn(
          "p-6 rounded-xl border border-blue-200",
          "bg-blue-50"
        )}>
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            💡 Pour commencer
          </h4>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Ajoutez des produits à votre devis pour voir les calculs en temps réel.
          </p>
        </div>
      )}
    </div>
  );
}