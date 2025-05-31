"use client";

import { cn } from "@/lib/utils/cn";
import { useProducts } from "@/lib/hooks/useProducts";
import { ProductCard } from "./ProductCard";
import { Product } from "@/types";
import { Search, Filter, Package, TrendingUp } from "lucide-react";

interface ProductSearchProps {
  onSelect: (product: Product) => void;
  className?: string;
}

/**
 * Interface complète de recherche de produits
 * Filtres + tri + grille de résultats
 */
export function ProductSearch({ onSelect, className }: ProductSearchProps) {
  const {
    products,
    loading,
    searchQuery,
    selectedCategory,
    sortBy,
    setSearchQuery,
    setSelectedCategory,
    setSortBy,
    categories,
    stats
  } = useProducts();

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header avec statistiques */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={cn(
            "p-3 rounded-lg",
            "bg-gradient-to-br from-indigo-500/20 to-purple-600/20",
            "border border-gray100 backdrop-blur-sm"
          )}>
            <Package className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Catalogue produits
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {stats.total} produits • {stats.categories} catégories
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-sm">
          <div className="text-center">
            <div className="text-lg font-bold text-green-600 dark:text-green-400">
              {stats.margeGlobaleMoyenne.toFixed(1)}%
            </div>
            <div className="text-gray-500">Marge moy.</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {stats.prixMoyen.toFixed(2)}€
            </div>
            <div className="text-gray-500">Prix moy.</div>
          </div>
        </div>
      </div>

      {/* Barre de recherche et filtres */}
      <div className={cn(
        "p-4 rounded-xl border border-gray-200",
        "bg-white/5 backdrop-blur-md",
        "supports-[backdrop-filter]:bg-white/5"
      )}>
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Recherche */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-500" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par nom, code ou catégorie..."
              className={cn(
                "w-full pl-10 pr-4 py-3 rounded-lg transition-all duration-200",
                "bg-gray-100 backdrop-blur-sm border border-gray-200",
                "text-gray-900 dark:text-gray-100 placeholder-gray-500",
                "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
              )}
            />
          </div>

          {/* Filtre catégorie */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="w-5 h-5 text-gray-500" />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={cn(
                "pl-10 pr-8 py-3 rounded-lg transition-all duration-200 appearance-none",
                "bg-gray-100 backdrop-blur-sm border border-gray-200",
                "text-gray-900 dark:text-gray-100",
                "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
              )}
            >
              <option value="">Toutes catégories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Tri */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <TrendingUp className="w-5 h-5 text-gray-500" />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'margin')}
              className={cn(
                "pl-10 pr-8 py-3 rounded-lg transition-all duration-200 appearance-none",
                "bg-gray-100 backdrop-blur-sm border border-gray-200",
                "text-gray-900 dark:text-gray-100",
                "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
              )}
            >
              <option value="name">Trier par nom</option>
              <option value="price">Trier par prix</option>
              <option value="margin">Trier par marge</option>
            </select>
          </div>
        </div>
      </div>

      {/* Résultats */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={cn(
              "h-64 rounded-xl animate-pulse",
              "bg-white/5 border border-gray100"
            )} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className={cn(
          "p-12 rounded-xl text-center",
          "bg-white/5 border border-gray100"
        )}>
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Aucun produit trouvé
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Essayez de modifier vos critères de recherche
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.code}
              product={product}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}

      {/* Footer avec résumé */}
      {products.length > 0 && (
        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <span>
            {products.length} produit{products.length > 1 ? 's' : ''} affiché{products.length > 1 ? 's' : ''}
          </span>
          <span>
            💡 Cliquez sur un produit pour l'ajouter au devis
          </span>
        </div>
      )}
    </div>
  );
}