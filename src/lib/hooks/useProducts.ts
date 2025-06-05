"use client";

import { useState, useEffect, useCallback } from "react";
import { Product } from "@/types";
import { ProductStorage } from "@/lib/storage/productStorage";
import { SIMPLIFIED_PRODUCTS } from "@/data/products/simplifiedProducts";

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategory: string;
  sortBy: 'name' | 'price' | 'margin';
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setSortBy: (sort: 'name' | 'price' | 'margin') => void;
  getProductByCode: (code: string) => Product | null;
  categories: string[];
  stats: {
    total: number;
    categories: number;
    margeGlobaleMoyenne: number;
    prixMoyen: number;
  };
}

/**
 * Hook useProducts FINAL
 * Compatible avec simplifiedProducts.ts (ProductCreateInput[])
 */
export function useProducts(): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'margin'>('name');
  const [isClient, setIsClient] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    categories: 0,
    margeGlobaleMoyenne: 0,
    prixMoyen: 0
  });

  // Initialisation côté client avec diagnostic
  useEffect(() => {
    setIsClient(true);
    console.log("🔍 Hook useProducts - Initialisation SIMPLIFIED_PRODUCTS");
    console.log(`📦 Source: ${SIMPLIFIED_PRODUCTS.length} ProductCreateInput`);
    ProductStorage.diagnostic();
  }, []);

  // Chargement et filtrage des produits
  const loadProducts = useCallback(() => {
    if (!isClient) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Récupérer produits convertis
      let allProducts = ProductStorage.getProducts();
      
      console.log(`📦 Produits convertis chargés: ${allProducts.length}`);
      
      // VALIDATION critique
      const expectedCount = SIMPLIFIED_PRODUCTS.length;
      if (allProducts.length !== expectedCount) {
        console.error(`❌ ERREUR: ${allProducts.length}/${expectedCount} produits!`);
        setError(`Conversion échouée: ${allProducts.length}/${expectedCount} produits`);
        return;
      }
      
      // Appliquer recherche
      if (searchQuery) {
        allProducts = ProductStorage.searchProducts(searchQuery);
        console.log(`🔍 Recherche "${searchQuery}": ${allProducts.length} résultats`);
      }
      
      // Appliquer filtre catégorie
      if (selectedCategory) {
        allProducts = allProducts.filter(p => p.categorie === selectedCategory);
        console.log(`🏷️ Catégorie "${selectedCategory}": ${allProducts.length} produits`);
      }
      
      // Appliquer tri
      allProducts = ProductStorage.sortProducts(allProducts, sortBy);
      
      setProducts(allProducts);
      
      // Charger métadonnées une seule fois
      if (categories.length === 0) {
        const detectedCategories = ProductStorage.getCategories();
        const detectedStats = ProductStorage.getProductStats();
        setCategories(detectedCategories);
        setStats(detectedStats);
        
        console.log(`🏷️ Catégories détectées: ${detectedCategories.join(', ')}`);
        console.log(`📊 Stats: ${detectedStats.total} produits, marge ${detectedStats.margeGlobaleMoyenne.toFixed(1)}%`);
      }
      
    } catch (err) {
      console.error("❌ Erreur chargement produits:", err);
      setError("Erreur lors du chargement des produits convertis");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, sortBy, isClient, categories.length]);

  // Effet pour charger les produits
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Récupérer un produit par code
  const getProductByCode = useCallback((code: string): Product | null => {
    if (!isClient) return null;
    return ProductStorage.getProductByCode(code);
  }, [isClient]);

  return {
    products,
    loading,
    error,
    searchQuery,
    selectedCategory,
    sortBy,
    setSearchQuery,
    setSelectedCategory,
    setSortBy,
    getProductByCode,
    categories,
    stats,
  };
}