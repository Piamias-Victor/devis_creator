"use client";

import { cn } from "@/lib/utils/cn";
import { DevisLine } from "@/types";
import { DevisTableRow } from "./DevisTableRow";
import { formatEuros } from "@/lib/utils/calculUtils";
import { Package } from "lucide-react";

interface DevisTableProps {
  lignes: DevisLine[];
  onUpdateLine: (id: string, updates: Partial<DevisLine>) => void;
  onDeleteLine: (id: string) => void;
  onDuplicateLine: (id: string) => void;
  onSaveLineToDatabase?: (ligne: DevisLine) => Promise<void>; // NOUVELLE PROP
  className?: string;
}

/**
 * Tableau devis AVEC support sauvegarde ligne
 * Transmission de la fonction de sauvegarde aux lignes
 */
export function DevisTable({ 
  lignes, 
  onUpdateLine, 
  onDeleteLine, 
  onDuplicateLine,
  onSaveLineToDatabase, // NOUVELLE PROP
  className 
}: DevisTableProps) {

  // Headers du tableau étendu avec colonne actions plus large
  const columns = [
    { key: "code", label: "Code", width: "w-20" },
    { key: "designation", label: "Désignation", width: "flex-1 min-w-[200px]" },
    { key: "quantite", label: "Qté", width: "w-16" },
    { key: "prixAchat", label: "Prix ₳", width: "w-20" },
    { key: "remise", label: "Rem", width: "w-16" },
    { key: "prixVente", label: "Prix €", width: "w-20" },
    { key: "tva", label: "TVA%", width: "w-16" },
    { key: "marge", label: "Marge", width: "w-20" },
    { key: "totalHT", label: "HT", width: "w-20" },
    { key: "totalTVA", label: "TVA", width: "w-20" },
    { key: "totalTTC", label: "TTC", width: "w-24" },
    { key: "actions", label: "Actions", width: "w-20" }, // ÉLARGI pour 4 boutons
  ];

  if (lignes.length === 0) {
    return (
      <div className={cn(
        "rounded-xl border border-gray-200 bg-white/5",
        "p-12 text-center",
        className
      )}>
        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Tableau des produits
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Utilisez la recherche pour ajouter des produits au devis
        </p>
      </div>
    );
  }

  // Calculs totaux
  const totals = lignes.reduce((acc, ligne) => ({
    totalHT: acc.totalHT + (ligne.totalHT || 0),
    totalTVA: acc.totalTVA + (ligne.totalTVA || 0),
    totalTTC: acc.totalTTC + (ligne.totalTTC || 0)
  }), { totalHT: 0, totalTVA: 0, totalTTC: 0 });

  return (
    <div className={cn(
      "rounded-xl border border-gray-200 bg-white/5 overflow-hidden w-full",
      className
    )}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px]">
          {/* Header étendu */}
          <thead className={cn(
            "bg-gray-100/10 border-b border-gray-100/10"
          )}>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    "px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider",
                    "text-gray-700 dark:text-gray-300",
                    column.width
                  )}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          
          {/* Body */}
          <tbody>
            {lignes.map((ligne) => (
              <DevisTableRow
                key={ligne.id}
                ligne={ligne}
                onUpdate={onUpdateLine}
                onDelete={onDeleteLine}
                onDuplicate={onDuplicateLine}
                onSaveToDatabase={onSaveLineToDatabase} // TRANSMISSION NOUVELLE PROP
              />
            ))}
          </tbody>
          
          {/* Footer avec totaux */}
          <tfoot className={cn(
            "bg-gray-100/20 border-t border-gray-200"
          )}>
            <tr>
              <td colSpan={8} className="px-3 py-4 text-right font-semibold text-gray-900 dark:text-gray-100">
                TOTAUX:
              </td>
              <td className="px-3 py-4 font-bold text-blue-600 dark:text-blue-400">
                {formatEuros(totals.totalHT)}
              </td>
              <td className="px-3 py-4 font-bold text-purple-600 dark:text-purple-400">
                {formatEuros(totals.totalTVA)}
              </td>
              <td className="px-3 py-4 font-bold text-green-600 dark:text-green-400 text-lg">
                {formatEuros(totals.totalTTC)}
              </td>
              <td className="px-3 py-4"></td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Instructions d'utilisation MISES À JOUR */}
      <div className={cn(
        "px-6 py-4 border-t border-gray-200",
        "bg-gray-50/50 text-sm text-gray-600 dark:text-gray-400"
      )}>
        <div className="flex justify-between items-center">
          <div>
            💡 <strong>Double-cliquez</strong> sur Qté, Prix, Remise pour éditer • 
            <strong>Bouton Save</strong> pour enregistrer en DB • 
            <strong>Enter</strong> valider • <strong>Escape</strong> annuler
          </div>
          <div>
            {lignes.length} produit{lignes.length > 1 ? 's' : ''} • Calculs automatiques
          </div>
        </div>
      </div>
    </div>
  );
}