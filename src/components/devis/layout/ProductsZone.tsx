"use client";

import { cn } from "@/lib/utils/cn";
import { DevisLine, Product } from "@/types";
import { Plus, Package } from "lucide-react";
import { ProductCombobox } from "../../products/ProductCombobox";
import { DevisTable } from "../table/DevisTable";

interface ProductsZoneProps {
  lignes: DevisLine[];
  onAddProduct: (product?: Product) => void;
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
 * Zone centrale des produits du devis
 * Recherche produits + Tableau interactif complet
 */
export function ProductsZone({ 
  lignes, 
  onAddProduct, 
  onUpdateLine, 
  onDeleteLine,
  onDuplicateLine,
  totals,
  className 
}: ProductsZoneProps) {

  // Ajouter un produit depuis la recherche
  const handleSelectProduct = (product: Product) => {
    onAddProduct(product);
  };

  return (
    <div className={cn("flex-1 space-y-4", className)}>
      {/* Header avec recherche produits */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={cn(
            "p-2 rounded-lg",
            "bg-gradient-to-br from-indigo-500/20 to-purple-600/20",
            "border border-gray100"
          )}>
            <Package className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Produits du devis
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {lignes.length} produit{lignes.length > 1 ? 's' : ''} ajouté{lignes.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Barre de recherche produits */}
      <div className="flex gap-3">
        <ProductCombobox
          onSelect={handleSelectProduct}
          placeholder="🔍 Rechercher et ajouter un produit..."
          className="flex-1"
        />
      </div>

      {/* Tableau interactif des produits */}
      <DevisTable
        lignes={lignes}
        onUpdateLine={onUpdateLine}
        onDeleteLine={onDeleteLine}
        onDuplicateLine={onDuplicateLine}
        totals={totals}
        className="min-h-[400px]"
      />

      {/* Footer avec raccourcis clavier */}
      <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
        
        <div className="text-right">
          <span>
            {lignes.length > 0 ? 
              `Tableau interactif • ${totals.totalHT.toFixed(2)}€ HT` : 
              "Base produits: 20 articles disponibles"
            }
          </span>
        </div>
      </div>
    </div>
  );
}