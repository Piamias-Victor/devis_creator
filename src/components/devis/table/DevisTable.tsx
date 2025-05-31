"use client";

import { cn } from "@/lib/utils/cn";
import { DevisLine } from "@/types";
import { DevisTableHeader } from "./DevisTableHeader";
import { DevisTableRow } from "./DevisTableRow";
import { formatPrice } from "@/lib/utils/devisUtils";
import { Package } from "lucide-react";

interface DevisTableProps {
  lignes: DevisLine[];
  onUpdateLine: (id: string, updates: Partial<DevisLine>) => void;
  onDeleteLine: (id: string) => void;
  onDuplicateLine: (id: string) => void;
  totals: {
    totalHT: number;
    totalTVA: number;
    totalTTC: number;
  };
  className?: string;
}

/**
 * Tableau interactif des lignes de devis
 * Édition inline + calculs temps réel + glassmorphism
 */
export function DevisTable({ 
  lignes, 
  onUpdateLine, 
  onDeleteLine, 
  onDuplicateLine,
  totals,
  className 
}: DevisTableProps) {

  if (lignes.length === 0) {
    return (
      <div className={cn(
        "rounded-xl border border-gray-200 bg-gray-50 backdrop-blur-md",
        "p-12 text-center",
        className
      )}>
        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Aucun produit dans le devis
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Utilisez la recherche ci-dessus pour ajouter des produits
        </p>
      </div>
    );
  }

  return (
    <div className={cn(
      "rounded-xl border border-gray-200 bg-gray-50 backdrop-blur-md overflow-hidden",
      className
    )}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <DevisTableHeader />
          
          <tbody>
            {lignes.map((ligne, index) => (
              <DevisTableRow
                key={ligne.id}
                ligne={ligne}
                onUpdate={onUpdateLine}
                onDelete={onDeleteLine}
                onDuplicate={onDuplicateLine}
              />
            ))}
          </tbody>
          
          {/* Footer avec totaux - 10 colonnes total */}
          <tfoot className={cn(
            "bg-gray-100 backdrop-blur-sm border-t border-gray-200"
          )}>
            <tr>
              <td colSpan={8} className="px-4 py-4 text-right font-semibold text-gray-900 dark:text-gray-100">
                Total HT:
              </td>
              <td className="px-4 py-4 font-bold text-gray-900 dark:text-gray-100">
                {formatPrice(totals.totalHT)}
              </td>
              <td className="px-4 py-4"></td>
            </tr>
            
            <tr>
              <td colSpan={8} className="px-4 py-2 text-right font-semibold text-gray-900 dark:text-gray-100">
                TVA (20%):
              </td>
              <td className="px-4 py-2 font-bold text-gray-900 dark:text-gray-100">
                {formatPrice(totals.totalTVA)}
              </td>
              <td className="px-4 py-2"></td>
            </tr>
            
            <tr className="border-t border-red-400">
              <td colSpan={8} className="px-4 py-4 text-right text-lg font-bold text-gray-900 dark:text-gray-100">
                Total TTC:
              </td>
              <td className="px-4 py-4 text-lg font-bold text-blue-600 dark:text-blue-400">
                {formatPrice(totals.totalTTC)}
              </td>
              <td className="px-4 py-4"></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Instructions d'utilisation */}
      <div className={cn(
        "px-6 py-4 border-t border-gray-200",
        "bg-gray-50 text-sm text-gray-600 dark:text-gray-400"
      )}>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span>💡 <strong>Double-cliquez</strong> sur Qté, Prix Achat, Remise ou Prix Vente pour éditer</span>
            <span>⌨️ <strong>Enter</strong> valider • <strong>Escape</strong> annuler</span>
          </div>
          
          <div className="text-right">
            <span>{lignes.length} ligne{lignes.length > 1 ? 's' : ''} • {totals.totalHT > 0 ? 'Modifiable' : 'Vide'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}