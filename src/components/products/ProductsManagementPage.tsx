"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { Plus, Search, Package, Download } from "lucide-react";
import { useProductsCRUD } from "@/lib/hooks/useProductsCRUD";
import { ProductTable } from "./ProductTable";
import { ProductModal } from "./ProductModal";
import { Product, ProductCreateInput } from "@/types/product";

/**
 * Page principale de gestion des produits
 * Interface CRUD complète avec affichage en ligne
 * Composant < 100 lignes
 */
export function ProductsManagementPage() {
  const {
    products,
    loading,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    ascending,
    setAscending,
    addProduct,
    updateProduct,
    deleteProduct,
    exportCSV,
    stats
  } = useProductsCRUD();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Créer nouveau produit
  const handleCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  // Modifier produit
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  // Supprimer produit
  const handleDelete = async (product: Product) => {
    if (!confirm(`Supprimer "${product.designation}" ?`)) return;
    
    try {
      await deleteProduct(product.code);
    } catch (error) {
      alert("Erreur lors de la suppression");
    }
  };

  // Sauvegarder produit (création/modification)
  const handleSave = async (productData: ProductCreateInput) => {
    setModalLoading(true);
    
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.code, productData);
      } else {
        await addProduct(productData);
      }
      setIsModalOpen(false);
      setEditingProduct(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur inconnue";
      alert(message);
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="space-y-6">
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Gestion des produits
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {stats.total} produits • Marge moyenne: {stats.margeMoyenne.toFixed(1)}%
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={exportCSV}
            className={cn(
              "flex items-center space-x-2 px-4 py-2 rounded-lg",
              "bg-gray-200 hover:bg-gray-300 border border-white/30",
              "backdrop-blur-sm text-gray-700 dark:text-gray-300",
              "transition-all duration-200 text-sm font-medium"
            )}
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleCreate}
            className={cn(
              "flex items-center space-x-2 px-6 py-3 rounded-lg",
              "bg-indigo-600 hover:bg-indigo-700 text-white",
              "transition-all duration-200 font-medium",
              "shadow-lg shadow-indigo-600/25 hover:shadow-xl hover:shadow-indigo-600/30",
              "hover:-translate-y-0.5"
            )}
          >
            <Plus className="w-5 h-5" />
            <span>Nouveau produit</span>
          </button>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-gray-500" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher par nom ou code produit..."
          className={cn(
            "w-full pl-12 pr-4 py-3 rounded-lg transition-all duration-200",
            "bg-gray-100 backdrop-blur-sm border border-gray-200",
            "text-gray-900 dark:text-gray-100 placeholder-gray-500",
            "focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50"
          )}
        />
      </div>

      {/* Tableau des produits */}
      <ProductTable
        products={products}
        loading={loading}
        sortBy={sortBy}
        ascending={ascending}
        onSort={(field) => {
          if (sortBy === field) {
            setAscending(!ascending);
          } else {
            setSortBy(field);
            setAscending(true);
          }
        }}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modal création/modification */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSave}
        product={editingProduct}
        loading={modalLoading}
      />
    </div>
  );
}