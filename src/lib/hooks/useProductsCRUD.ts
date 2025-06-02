"use client";

import { useState, useEffect, useCallback } from "react";
import { Product, ProductCreateInput, ProductSortBy } from "@/types/product";
import { ProductStorageCRUD } from "@/lib/storage/productStorageCRUD";

interface UseProductsCRUDReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  sortBy: ProductSortBy;
  ascending: boolean;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: ProductSortBy) => void;
  setAscending: (asc: boolean) => void;
  addProduct: (product: ProductCreateInput) => Promise<Product>;
  updateProduct: (code: string, updates: Partial<ProductCreateInput>) => Promise<Product>;
  deleteProduct: (code: string) => Promise<boolean>;
  getProductByCode: (code: string) => Product | null;
  exportCSV: () => void;
  resetToDefault: () => void;
  stats: {
    total: number;
    prixMoyenAchat: number;
    prixMoyenVente: number;
    margeMoyenne: number;
    totalStock: number;
  };
}

/**
 * Hook personnalisé pour la gestion CRUD des produits
 * Recherche, tri, filtrage et statistiques en temps réel
 */
export function useProductsCRUD(): UseProductsCRUDReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<ProductSortBy>('designation');
  const [ascending, setAscending] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    prixMoyenAchat: 0,
    prixMoyenVente: 0,
    margeMoyenne: 0,
    totalStock: 0
  });

  // Initialisation côté client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Chargement et filtrage des produits
  const loadProducts = useCallback(() => {
    if (!isClient) return;
    
    try {
      setLoading(true);
      setError(null);
      
      let filteredProducts = ProductStorageCRUD.getProducts();
      
      // Appliquer recherche
      if (searchQuery) {
        filteredProducts = ProductStorageCRUD.searchProducts({ searchQuery });
      }
      
      // Appliquer tri
      filteredProducts = ProductStorageCRUD.sortProducts(filteredProducts, sortBy, ascending);
      
      setProducts(filteredProducts);
      
      // Charger les statistiques
      setStats(ProductStorageCRUD.getProductStats());
      
    } catch (err) {
      setError("Erreur lors du chargement des produits");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, sortBy, ascending, isClient]);

  // Effet pour charger les produits
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Ajouter un produit
  const addProduct = useCallback(async (productData: ProductCreateInput): Promise<Product> => {
    try {
      const newProduct = ProductStorageCRUD.addProduct(productData);
      loadProducts(); // Recharger la liste
      return newProduct;
    } catch (error) {
      throw error;
    }
  }, [loadProducts]);

  // Mettre à jour un produit
  const updateProduct = useCallback(async (
    code: string, 
    updates: Partial<ProductCreateInput>
  ): Promise<Product> => {
    try {
      const updatedProduct = ProductStorageCRUD.updateProduct(code, updates);
      loadProducts(); // Recharger la liste
      return updatedProduct;
    } catch (error) {
      throw error;
    }
  }, [loadProducts]);

  // Supprimer un produit
  const deleteProduct = useCallback(async (code: string): Promise<boolean> => {
    try {
      const success = ProductStorageCRUD.deleteProduct(code);
      if (success) {
        loadProducts(); // Recharger la liste
      }
      return success;
    } catch (error) {
      throw error;
    }
  }, [loadProducts]);

  // Récupérer un produit par code
  const getProductByCode = useCallback((code: string): Product | null => {
    if (!isClient) return null;
    return ProductStorageCRUD.getProductByCode(code);
  }, [isClient]);

  // Export CSV
  const exportCSV = useCallback(() => {
    try {
      const csvContent = ProductStorageCRUD.exportToCSV();
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `produits_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Erreur export CSV:', error);
      alert('Erreur lors de l\'export CSV');
    }
  }, []);

  // Réinitialiser aux valeurs par défaut
  const resetToDefault = useCallback(() => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les produits ?')) {
      ProductStorageCRUD.resetToDefault();
      loadProducts();
    }
  }, [loadProducts]);

  return {
    products,
    loading,
    error,
    searchQuery,
    sortBy,
    ascending,
    setSearchQuery,
    setSortBy,
    setAscending,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductByCode,
    exportCSV,
    resetToDefault,
    stats,
  };
}