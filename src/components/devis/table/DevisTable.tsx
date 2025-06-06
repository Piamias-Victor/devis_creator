"use client";

import { cn } from "@/lib/utils/cn";
import { DevisLine } from "@/types";
import { DevisTableRow } from "./DevisTableRow";
import { formatEuros } from "@/lib/utils/calculUtils";
import { Package, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { useDevisSort, DevisSortField } from "./useDevisSort";
import { SortControls } from "./SortControls";

interface DevisTableProps {
  lignes: DevisLine[];
  onUpdateLine: (id: string, updates: Partial<DevisLine>) => void;
  onDeleteLine: (id: string) => void;
  onDuplicateLine: (id: string) => void;
  onSaveLineToDatabase?: (ligne: DevisLine) => Promise<void>;
  className?: string;
}

/**
 * Tableau devis AVEC TRI INTÉGRÉ
 * Headers cliquables + contrôles de tri + transmission sauvegarde
 */
export function DevisTable({ 
  lignes, 
  onUpdateLine, 
  onDeleteLine, 
  onDuplicateLine,
  onSaveLineToDatabase, 
  className 
}: DevisTableProps) {

  // Hook de tri intégré
  const {
    sortedLignes,
    sortField,
    sortDirection,
    toggleSort,
    resetSort
  } = useDevisSort(lignes);

  // Headers du tableau avec tri
  const columns = [
    { key: "code", label: "Code", width: "w-20", sortable: false },
    { key: "designation", label: "Désignation", width: "flex-1 min-w-[200px]", sortable: true, sortField: 'designation' as DevisSortField },
    { key: "quantite", label: "Qté", width: "w-16", sortable: true, sortField: 'quantite' as DevisSortField },
    { key: "prixAchat", label: "Prix ₳", width: "w-20", sortable: false },
    { key: "remise", label: "Rem", width: "w-16", sortable: false },
    { key: "prixVente", label: "Prix €", width: "w-20", sortable: true, sortField: 'prixUnitaire' as DevisSortField },
    { key: "tva", label: "TVA%", width: "w-16", sortable: false },
    { key: "marge", label: "Marge", width: "w-20", sortable: true, sortField: 'margePourcent' as DevisSortField },
    { key: "totalHT", label: "HT", width: "w-20", sortable: false },
    { key: "totalTVA", label: "TVA", width: "w-20", sortable: false },
    { key: "totalTTC", label: "TTC", width: "w-24", sortable: true, sortField: 'totalTTC' as DevisSortField },
    { key: "actions", label: "Actions", width: "w-20", sortable: false },
  ];

  // Composant header cliquable
  const SortableHeader = ({ column }: { column: typeof columns[0] }) => {
    const isActive = column.sortField === sortField;
    const canSort = column.sortable && column.sortField;

    if (!canSort) {
      return (
        <th className={cn(
          "px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider",
          "text-gray-700 dark:text-gray-300",
          column.width
        )}>
          {column.label}
        </th>
      );
    }

    return (
      <th className={cn("px-4 py-4 text-left", column.width)}>
        <button
          onClick={() => toggleSort(column.sortField!)}
          className={cn(
            "flex items-center space-x-1 text-xs font-semibold uppercase tracking-wider",
            "transition-colors duration-200 hover:text-blue-600 dark:hover:text-blue-400",
            isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"
          )}
          title={`Trier par ${column.label}`}
        >
          <span>{column.label}</span>
          {isActive ? (
            sortDirection === 'asc' ? (
              <ArrowUp className="w-3 h-3" />
            ) : (
              <ArrowDown className="w-3 h-3" />
            )
          ) : (
            <ArrowUpDown className="w-3 h-3 opacity-50" />
          )}
        </button>
      </th>
    );
  };

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

  // Calculs totaux (utiliser les lignes triées)
  const totals = sortedLignes.reduce((acc, ligne) => ({
    totalHT: acc.totalHT + (ligne.totalHT || 0),
    totalTVA: acc.totalTVA + (ligne.totalTVA || 0),
    totalTTC: acc.totalTTC + (ligne.totalTTC || 0)
  }), { totalHT: 0, totalTVA: 0, totalTTC: 0 });

  return (
    <div className={cn("space-y-4", className)}>
      {/* Contrôles de tri */}
      <SortControls
        sortField={sortField}
        sortDirection={sortDirection}
        onToggleSort={toggleSort}
        onResetSort={resetSort}
        lignesCount={lignes.length}
      />

      {/* Tableau */}
      <div className={cn(
        "rounded-xl border border-gray-200 bg-white/5 overflow-hidden w-full"
      )}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            {/* Header avec tri */}
            <thead className={cn(
              "bg-gray-100/10 border-b border-gray-100/10"
            )}>
              <tr>
                {columns.map((column) => (
                  <SortableHeader key={column.key} column={column} />
                ))}
              </tr>
            </thead>
            
            {/* Body avec lignes triées */}
            <tbody>
              {sortedLignes.map((ligne) => (
                <DevisTableRow
                  key={ligne.id}
                  ligne={ligne}
                  onUpdate={onUpdateLine}
                  onDelete={onDeleteLine}
                  onDuplicate={onDuplicateLine}
                  onSaveToDatabase={onSaveLineToDatabase}
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

        {/* Instructions d'utilisation */}
        <div className={cn(
          "px-6 py-4 border-t border-gray-200",
          "bg-gray-50/50 text-sm text-gray-600 dark:text-gray-400"
        )}>
          <div className="flex justify-between items-center">
            <div>
              💡 <strong>Headers cliquables</strong> pour trier • 
              <strong>Double-clic</strong> sur valeurs pour éditer • 
              <strong>Save</strong> pour enregistrer en DB
            </div>
            <div>
              {lignes.length} produit{lignes.length > 1 ? 's' : ''} • 
              Tri: {columns.find(c => c.sortField === sortField)?.label || 'Défaut'} 
              ({sortDirection === 'asc' ? '↑' : '↓'})
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}