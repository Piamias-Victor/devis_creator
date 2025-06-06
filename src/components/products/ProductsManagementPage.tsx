"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { Plus, Search, Package, Download } from "lucide-react";
import { useProductsCRUD } from "@/lib/hooks/useProductsCRUD";
import { ProductTable } from "./ProductTable";
import { ProductModal } from "./ProductModal";
import { Product } from "@/types";

/**
 * Page principale de gestion des produits AVEC DUPLICATION
 * Interface CRUD complète + fonction dupliquer
 */
export function ProductsManagementPage() {
  const {
    products,
    loading,
    searchQuery,
    setSearchQuery,
    addProduct,
    updateProduct,
    deleteProduct,
    exportCSV,
    stats,
    crudLoading,
    crudError
  } = useProductsCRUD();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDuplicating, setIsDuplicating] = useState(false); // ✅ NOUVEAU STATE

  // GUARDS pour éviter les erreurs undefined
  const safeStats = {
    total: stats?.total || 0,
    margeMoyenne: stats?.margeGlobaleMoyenne || 0,
    categories: stats?.categories || 0,
    prixMoyen: stats?.prixMoyen || 0
  };

  // Créer nouveau produit
  const handleCreate = () => {
    setEditingProduct(null);
    setIsDuplicating(false); // ✅ RESET flag duplication
    setIsModalOpen(true);
  };

  // Modifier produit
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsDuplicating(false); // ✅ Mode modification
    setIsModalOpen(true);
  };

  // ✅ NOUVELLE FONCTION : Dupliquer produit
  const handleDuplicate = (product: Product) => {
    console.log('🔄 Duplication produit:', product.designation);
    
    // Créer un produit "clone" avec nouveau code
    const duplicatedProduct: Product = {
      ...product,
      code: `${product.code}_COPY`, // Suffixe pour éviter conflit
      designation: `COPIE - ${product.designation}`,
      // Garder tous les autres champs identiques
    };
    
    setEditingProduct(duplicatedProduct);
    setIsDuplicating(true); // ✅ Flag duplication
    setIsModalOpen(true);
    
    console.log('✅ Modal ouverte en mode duplication avec données pré-remplies');
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

  // Sauvegarder produit (création/modification/duplication)
  const handleSave = async (productData: any) => {
    try {
      if (editingProduct && !isDuplicating) {
        // ✅ Mode modification classique
        await updateProduct(editingProduct.code, productData);
        console.log('✅ Produit modifié:', productData.designation);
      } else {
        // ✅ Mode création OU duplication (nouveau produit dans les 2 cas)
        await addProduct(productData);
        console.log('✅ Produit créé/dupliqué:', productData.designation);
      }
      
      setIsModalOpen(false);
      setEditingProduct(null);
      setIsDuplicating(false); // ✅ RESET flag
      
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur inconnue";
      alert(message);
    }
  };

  // ✅ FONCTION pour fermer modal avec reset
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setIsDuplicating(false); // ✅ RESET flag
  };

  return (
    <div className="space-y-6">
      {/* Header avec statistiques PROTÉGÉES */}
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
              {safeStats.total} produits • Marge moyenne: {safeStats.margeMoyenne.toFixed(1)}%
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={exportCSV}
            disabled={loading || safeStats.total === 0}
            className={cn(
              "flex items-center space-x-2 px-4 py-2 rounded-lg",
              "bg-gray-200 hover:bg-gray-300 border border-white/30",
              "backdrop-blur-sm text-gray-700 dark:text-gray-300",
              "transition-all duration-200 text-sm font-medium",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleCreate}
            disabled={crudLoading}
            className={cn(
              "flex items-center space-x-2 px-6 py-3 rounded-lg",
              "bg-indigo-600 hover:bg-indigo-700 text-white",
              "transition-all duration-200 font-medium",
              "shadow-lg shadow-indigo-600/25 hover:shadow-xl hover:shadow-indigo-600/30",
              "hover:-translate-y-0.5",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <Plus className="w-5 h-5" />
            <span>Nouveau produit</span>
          </button>
        </div>
      </div>

      {/* Erreur CRUD */}
      {crudError && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200">
          <p className="text-red-700">{crudError}</p>
        </div>
      )}

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

      {/* Tableau des produits AVEC DUPLICATION */}
      <ProductTable
        products={products}
        loading={loading}
        sortBy="designation"
        ascending={true}
        onSort={() => {}} // Placeholder pour le tri
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate} // ✅ NOUVELLE PROP
      />

      {/* Modal création/modification/duplication */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal} // ✅ Fonction avec reset
        onSave={handleSave}
        product={editingProduct}
        loading={crudLoading}
        isDuplicating={isDuplicating} // ✅ NOUVELLE PROP optionnelle
      />
    </div>
  );
}