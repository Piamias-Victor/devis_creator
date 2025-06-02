"use client";

import { useState, useEffect, useCallback } from "react";
import { Product } from "@/types/product";
import { ProductStorageCRUD } from "@/lib/storage/productStorageCRUD";

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  getProductByCode: (code: string) => Product | null;
  refreshProducts: () => void; // NOUVEAU: fonction pour forcer le rechargement
  stats: {
    total: number;
    margeGlobaleMoyenne: number;
    prixMoyen: number;
  };
}

/**
 * Hook produits AMÉLIORÉ pour recherche et sélection
 * Compatible avec le nouveau système CRUD + refresh automatique
 * Version allégée pour utilisation dans les devis
 */
export function useProducts(): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // NOUVEAU: pour forcer refresh
  const [stats, setStats] = useState({
    total: 0,
    margeGlobaleMoyenne: 0,
    prixMoyen: 0
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
      
      setProducts(filteredProducts);
      
      // Calculer stats simplifiées
      if (filteredProducts.length > 0) {
        const total = filteredProducts.length;
        const margeGlobaleMoyenne = filteredProducts.reduce((sum, p) => {
          const marge = p.prixVente && p.prixAchat 
            ? ((p.prixVente - p.prixAchat) / p.prixAchat) * 100 
            : 0;
          return sum + marge;
        }, 0) / total;
        
        const prixMoyen = filteredProducts.reduce((sum, p) => sum + (p.prixVente || 0), 0) / total;
        
        setStats({ total, margeGlobaleMoyenne, prixMoyen });
      } else {
        setStats({ total: 0, margeGlobaleMoyenne: 0, prixMoyen: 0 });
      }
      
    } catch (err) {
      setError("Erreur lors du chargement des produits");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, isClient, refreshTrigger]); // AJOUT: refreshTrigger comme dépendance

  // Effet pour charger les produits
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Récupérer un produit par code (avec cache refresh)
  const getProductByCode = useCallback((code: string): Product | null => {
    if (!isClient) return null;
    return ProductStorageCRUD.getProductByCode(code);
  }, [isClient, refreshTrigger]); // AJOUT: refreshTrigger pour recalculer

  // NOUVEAU: Fonction pour forcer le rechargement
  const refreshProducts = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // NOUVEAU: Écouter les changements dans localStorage pour refresh automatique
  useEffect(() => {
    if (!isClient) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "devis_creator_products_v2") {
        console.log("📦 Produits mis à jour - refresh automatique");
        refreshProducts();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    
    // BONUS: Écouter les changements custom de notre app
    const handleCustomRefresh = () => {
      refreshProducts();
    };
    
    window.addEventListener("products-updated", handleCustomRefresh);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("products-updated", handleCustomRefresh);
    };
  }, [isClient, refreshProducts]);

  return {
    products,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    getProductByCode,
    refreshProducts, // NOUVEAU: exposer la fonction de refresh
    stats,
  };
}