"use client";

import { cn } from "@/lib/utils/cn";
import { DevisLine } from "@/types";
import { MargeUtils } from "@/lib/utils/margeUtils";
import { MargeIndicator } from "./MargeIndicator";
import { RemiseGlobale } from "./RemiseGlobale";
import { formatPrice } from "@/lib/utils/devisUtils";
import { Calculator, Package, Euro, Target } from "lucide-react";

interface CalculsAvancesProps {
  lignes: DevisLine[];
  remiseGlobale: number;
  onChangeRemiseGlobale: (remise: number) => void;
  totals: {
    totalHT: number;
    totalTVA: number;
    totalTTC: number;
  };
  className?: string;
}

/**
 * Sidebar de calculs avancés avec analyse de marge
 * Remise globale + indicateurs + statistiques détaillées
 */
export function CalculsAvances({ 
  lignes, 
  remiseGlobale,
  onChangeRemiseGlobale,
  totals,
  className 
}: CalculsAvancesProps) {
  
  // Analyse des marges
  const margeAnalysis = MargeUtils.analyserMarges(lignes);
  
  // Calculs avec remise globale
  const totalAvantRemise = totals.totalHT;
  const montantRemiseGlobale = (totalAvantRemise * remiseGlobale) / 100;
  const totalApresRemise = totalAvantRemise - montantRemiseGlobale;
  const tvaApresRemise = totalApresRemise * 0.2;
  const totalTTCFinal = totalApresRemise + tvaApresRemise;

  return (
    <div className={cn("w-80 space-y-4", className)}>
      {/* Indicateur de marge globale */}
      {lignes.length > 0 && (
        <MargeIndicator
          margeEuros={margeAnalysis.margeGlobaleEuros}
          margePourcent={margeAnalysis.margeGlobalePourcent}
        />
      )}

      {/* Remise globale */}
      <RemiseGlobale
        totalHT={totalAvantRemise}
        remiseGlobale={remiseGlobale}
        onChangeRemise={onChangeRemiseGlobale}
      />

      {/* Résumé financier final */}
      <div className={cn(
        "p-4 rounded-lg border border-gray-100/20",
        "bg-gray-100/5 backdrop-blur-md"
      )}>
        <div className="flex items-center space-x-2 mb-4">
          <Calculator className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Totaux Finaux
          </span>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Total HT:</span>
            <span className="font-medium">{formatPrice(totalAvantRemise)}</span>
          </div>
          
          {remiseGlobale > 0 && (
            <div className="flex justify-between text-orange-600 dark:text-orange-400">
              <span>Remise globale:</span>
              <span>-{formatPrice(montantRemiseGlobale)}</span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Net HT:</span>
            <span className="font-medium">{formatPrice(totalApresRemise)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">TVA (20%):</span>
            <span className="font-medium">{formatPrice(tvaApresRemise)}</span>
          </div>
          
          <div className="border-t border-gray-100/10 pt-2">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-900 dark:text-gray-100">Total TTC:</span>
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {formatPrice(totalTTCFinal)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques avancées */}
      {lignes.length > 0 && (
        <div className={cn(
          "p-4 rounded-lg border border-gray-100/20",
          "bg-gray-100/5 backdrop-blur-md"
        )}>
          <div className="flex items-center space-x-2 mb-4">
            <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Analyse Détaillée
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="space-y-2">
              <div>
                <span className="text-gray-500 block">Marge moyenne</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {margeAnalysis.statistiques.margeMoyenne.toFixed(1)}%
                </span>
              </div>
              
              <div>
                <span className="text-gray-500 block">Lignes rentables</span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {margeAnalysis.statistiques.lignesRentables}/{lignes.length}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div>
                <span className="text-gray-500 block">Meilleure marge</span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {margeAnalysis.statistiques.meilleureMarge.toFixed(1)}%
                </span>
              </div>
              
              <div>
                <span className="text-gray-500 block">Total achat</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {formatPrice(margeAnalysis.statistiques.totalPrixAchat)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* État vide */}
      {lignes.length === 0 && (
        <div className={cn(
          "p-6 rounded-lg border border-gray-100/20 text-center",
          "bg-gray-100/5 backdrop-blur-md"
        )}>
          <Package className="w-8 h-8 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Ajoutez des produits pour voir les calculs avancés
          </p>
        </div>
      )}
    </div>
  );
}