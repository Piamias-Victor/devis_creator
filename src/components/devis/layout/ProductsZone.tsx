"use client";

import { cn } from "@/lib/utils/cn";
import { DevisLine, Product } from "@/types";
import { Plus, Package, RefreshCw } from "lucide-react";
import { ProductCombobox } from "../../products/ProductCombobox";
import { DevisTable } from "../table/DevisTable";
import { useState } from "react";

interface ProductsZoneProps {
  lignes: DevisLine[];
  onAddProduct: (product?: Product) => void;
  onUpdateLine: (id: string, updates: Partial<DevisLine>) => void;
  onDeleteLine: (id: string) => void;
  onDuplicateLine: (id: string) => void;
  onRefreshProducts: () => Promise<void>;
  onSaveLineToDatabase?: (ligne: DevisLine) => Promise<void>; // NOUVELLE PROP
  totals: {
    totalHT: number;
    totalTVA: number;
    totalTTC: number;
  };
  className?: string;
}

/**
 * Zone centrale des produits du devis
 * Recherche produits + Tableau interactif complet + Actualisation
 */
export function ProductsZone({ 
  lignes, 
  onAddProduct, 
  onUpdateLine, 
  onDeleteLine,
  onDuplicateLine,
  onRefreshProducts,
  onSaveLineToDatabase, // NOUVELLE PROP
  totals,
  className 
}: ProductsZoneProps) {
  
  const [refreshing, setRefreshing] = useState(false);

  // Ajouter un produit depuis la recherche
  const handleSelectProduct = (product: Product) => {
    onAddProduct(product);
  };

  // Actualiser les informations produits
  const handleRefreshProducts = async () => {
    if (lignes.length === 0) {
      alert("Aucun produit à actualiser dans le devis");
      return;
    }

    if (!confirm(`Actualiser les informations de ${lignes.length} produit${lignes.length > 1 ? 's' : ''} ?\n\nCela mettra à jour les prix depuis la base de données.`)) {
      return;
    }

    try {
      setRefreshing(true);
      await onRefreshProducts();
      console.log('✅ Produits actualisés avec succès');
    } catch (error) {
      console.error('❌ Erreur actualisation produits:', error);
      alert('Erreur lors de l\'actualisation des produits');
    } finally {
      setRefreshing(false);
    }
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

        {/* NOUVEAU : Bouton Actualiser */}
        {lignes.length > 0 && (
          <button
            onClick={handleRefreshProducts}
            disabled={refreshing}
            className={cn(
              "flex items-center space-x-2 px-4 py-2 rounded-lg",
              "bg-blue-600/10 hover:bg-blue-600/20 border border-blue-600/30",
              "text-blue-700 dark:text-blue-300 transition-all duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "hover:-translate-y-0.5 hover:shadow-lg"
            )}
            title="Actualiser les prix depuis la base de données"
          >
            <RefreshCw className={cn(
              "w-4 h-4",
              refreshing && "animate-spin"
            )} />
            <span className="text-sm font-medium">
              {refreshing ? "Actualisation..." : "Actualiser"}
            </span>
          </button>
        )}
      </div>

      {/* Barre de recherche produits */}
      <div className="flex gap-3">
        <ProductCombobox
          onSelect={handleSelectProduct as any}
          placeholder="🔍 Rechercher et ajouter un produit..."
          className="flex-1"
        />
      </div>

      {/* Message d'information si actualisation en cours */}
      {refreshing && (
        <div className={cn(
          "p-3 rounded-lg border border-blue-200",
          "bg-blue-50/50 backdrop-blur-sm"
        )}>
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
            <span className="text-sm text-blue-700">
              Actualisation des prix depuis la base de données...
            </span>
          </div>
        </div>
      )}

      {/* Tableau interactif des produits */}
      <DevisTable
        lignes={lignes}
        onUpdateLine={onUpdateLine}
        onDeleteLine={onDeleteLine}
        onDuplicateLine={onDuplicateLine}
        onSaveLineToDatabase={onSaveLineToDatabase} // TRANSMISSION NOUVELLE PROP
        className="min-h-[400px]"
      />

      {/* Footer avec raccourcis clavier */}
      <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
        <div>
          {lignes.length > 0 && (
            <span className="text-xs">
              💡 Cliquez sur "Actualiser" pour mettre à jour les prix depuis la DB
            </span>
          )}
        </div>
        
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