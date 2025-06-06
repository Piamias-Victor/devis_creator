"use client";

import { cn } from "@/lib/utils/cn";
import { Product, ProductSortBy } from "@/types";
import { Edit, Trash2, Copy, ChevronUp, ChevronDown, Package } from "lucide-react";
import { formatPriceUnit } from "@/lib/utils/calculUtils";

// ✅ Utilitaire ProductUtils local
class ProductUtils {
  static calculateMargePercent(prixVente: number, prixAchat: number): number {
    if (prixAchat === 0) return 0;
    return ((prixVente - prixAchat) / prixAchat) * 100;
  }
}

interface ProductTableProps {
  products: Product[];
  loading: boolean;
  sortBy: ProductSortBy;
  ascending: boolean;
  onSort: (field: ProductSortBy) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onDuplicate: (product: Product) => void; // ✅ NOUVELLE PROP
}

/**
 * Tableau produits AVEC bouton dupliquer
 * Ajout action duplication avec icône Copy
 */
export function ProductTable({
  products,
  loading,
  sortBy,
  ascending,
  onSort,
  onEdit,
  onDelete,
  onDuplicate // ✅ NOUVELLE PROP
}: ProductTableProps) {

  // Configuration des colonnes
  const columns = [
    { key: 'code' as ProductSortBy, label: 'Code', width: 'w-32', sortable: true },
    { key: 'designation' as ProductSortBy, label: 'Désignation', width: 'flex-1', sortable: true },
    { key: 'prixAchat' as ProductSortBy, label: 'Prix Achat HT', width: 'w-32', sortable: true },
    { key: 'prixVente' as ProductSortBy, label: 'Prix Vente HT', width: 'w-32', sortable: true },
    { key: 'tva', label: 'TVA%', width: 'w-20', sortable: false },
    { key: 'colissage', label: 'Colissage', width: 'w-24', sortable: false },
    { key: 'marge', label: 'Marge', width: 'w-24', sortable: false },
    { key: 'actions', label: 'Actions', width: 'w-32', sortable: false } // ✅ ÉLARGI pour 3 boutons
  ];

  // Composant en-tête de colonne avec tri
  const SortableHeader = ({ column }: { column: typeof columns[0] }) => {
    const isActive = sortBy === column.key;

    return (
      <th className={cn("px-4 py-4 text-left", column.width)}>
        {column.sortable ? (
          <button
            onClick={() => onSort(column.key as ProductSortBy)}
            className={cn(
              "flex items-center space-x-1 text-sm font-semibold transition-colors",
              "hover:text-indigo-600 dark:hover:text-indigo-400",
              isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-700 dark:text-gray-300"
            )}
          >
            <span>{column.label}</span>
            {isActive && (
              ascending ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
            )}
          </button>
        ) : (
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {column.label}
          </span>
        )}
      </th>
    );
  };

  if (loading) {
    return (
      <div className={cn(
        "rounded-xl border border-gray-200 bg-white/5 backdrop-blur-md",
        "p-8 text-center"
      )}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={cn(
        "rounded-xl border border-gray-200 bg-white/5 backdrop-blur-md",
        "p-12 text-center"
      )}>
        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Aucun produit trouvé
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Utilisez le bouton "Nouveau produit" pour ajouter des produits
        </p>
      </div>
    );
  }

  return (
    <div className={cn(
      "rounded-xl border border-gray-200 bg-white/5 backdrop-blur-md overflow-hidden"
    )}>
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header */}
          <thead className="bg-gray-100/10 border-b border-gray-100/10">
            <tr>
              {columns.map((column) => (
                <SortableHeader key={column.key} column={column} />
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {products.map((product, index) => {
              const marge = ProductUtils.calculateMargePercent(product.prixVente || 0, product.prixAchat);
              
              return (
                <tr 
                  key={product.code}
                  className={cn(
                    "transition-colors duration-200 border-b border-gray-100/5 last:border-b-0",
                    "hover:bg-gray-100/5 group"
                  )}
                >
                  {/* Code */}
                  <td className="px-4 py-3 text-sm font-mono text-gray-700 dark:text-gray-300">
                    {product.code}
                  </td>

                  {/* Désignation */}
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                    {product.designation}
                  </td>

                  {/* Prix d'achat */}
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                    {formatPriceUnit(product.prixAchat)}
                  </td>

                  {/* Prix de vente */}
                  <td className="px-4 py-3 text-sm font-medium text-green-600 dark:text-green-400">
                    {formatPriceUnit(product.prixVente || 0)}
                  </td>

                  {/* TVA */}
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                    {product.tva}%
                  </td>

                  {/* Colissage */}
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                    {product.colissage}
                  </td>

                  {/* Marge */}
                  <td className="px-4 py-3 text-sm font-semibold text-blue-600 dark:text-blue-400">
                    {marge.toFixed(1)}%
                  </td>

                  {/* Actions ÉTENDUES */}
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* ✅ NOUVEAU : Bouton Dupliquer */}
                      <button
                        onClick={() => onDuplicate(product)}
                        className={cn(
                          "p-1 rounded hover:bg-green-500/20 text-green-600 dark:text-green-400",
                          "transition-colors duration-200"
                        )}
                        title="Dupliquer ce produit"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => onEdit(product)}
                        className={cn(
                          "p-1 rounded hover:bg-blue-500/20 text-blue-600 dark:text-blue-400",
                          "transition-colors duration-200"
                        )}
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => onDelete(product)}
                        className={cn(
                          "p-1 rounded hover:bg-red-500/20 text-red-600 dark:text-red-400",
                          "transition-colors duration-200"
                        )}
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer avec résumé */}
      <div className={cn(
        "px-6 py-4 border-t border-gray-200 bg-gray-50/50",
        "text-sm text-gray-600 dark:text-gray-400"
      )}>
        <div className="flex justify-between items-center">
          <span>{products.length} produit{products.length > 1 ? 's' : ''} affiché{products.length > 1 ? 's' : ''}</span>
          <span>💡 Survolez une ligne pour voir les actions • <Copy className="w-3 h-3 inline mx-1" /> pour dupliquer</span>
        </div>
      </div>
    </div>
  );
}