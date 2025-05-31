"use client";

import { cn } from "@/lib/utils/cn";
import { DevisCalculations } from "@/types";
import { formatEuros } from "@/lib/utils/calculUtils";
import { Calculator, Euro, TrendingUp } from "lucide-react";

interface FinancialSummaryProps {
  calculations: DevisCalculations;
  className?: string;
}

/**
 * Résumé financier horizontal 3 colonnes
 * Total HT | TVA (20%) | Total TTC
 */
export function FinancialSummary({ calculations, className }: FinancialSummaryProps) {
  const { totalHT, totalTVA, totalTTC, nombreLignes, quantiteTotale } = calculations;

  return (
    <div className={cn(
      "p-6 rounded-xl border border-gray-200 bg-white/5 backdrop-blur-md",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Calculator className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Résumé financier
          </h3>
        </div>
        
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {nombreLignes} ligne{nombreLignes > 1 ? 's' : ''} • {quantiteTotale} article{quantiteTotale > 1 ? 's' : ''}
        </div>
      </div>

      {/* Totaux 3 colonnes */}
      <div className="grid grid-cols-3 gap-6">
        {/* Total HT */}
        <div className="p-4 rounded-lg border border-gray-100/20 bg-blue-500/5 backdrop-blur-sm text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Euro className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total HT</span>
          </div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {formatEuros(totalHT)}
          </div>
        </div>

        {/* TVA */}
        <div className="p-4 rounded-lg border border-gray-100/20 bg-purple-500/5 backdrop-blur-sm text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">TVA (20%)</span>
          </div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {formatEuros(totalTVA)}
          </div>
        </div>

        {/* Total TTC */}
        <div className="p-4 rounded-lg border border-gray-100/20 bg-green-500/5 backdrop-blur-sm text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Calculator className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total TTC</span>
          </div>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            {formatEuros(totalTTC)}
          </div>
        </div>
      </div>

      {/* Message si vide */}
      {nombreLignes === 0 && (
        <div className="mt-6 p-4 rounded-lg bg-gray-100/10 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Les totaux s'afficheront après ajout de produits
          </p>
        </div>
      )}
    </div>
  );
}