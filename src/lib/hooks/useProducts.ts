"use client";

import { useState, useEffect, useCallback } from "react";
import { Product } from "@/types";
import { ProductStorage } from "@/lib/storage/productStorage";

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
 * Hook personnalisé pour la gestion des produits
 * Recherche, filtrage, tri et statistiques
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
      
      let filteredProducts = ProductStorage.getProducts();
      
      // Appliquer recherche
      if (searchQuery) {
        filteredProducts = ProductStorage.searchProducts(searchQuery);
      }
      
      // Appliquer filtre catégorie
      if (selectedCategory) {
        filteredProducts = filteredProducts.filter(
          product => product.categorie === selectedCategory
        );
      }
      
      // Appliquer tri
      filteredProducts = ProductStorage.sortProducts(filteredProducts, sortBy);
      
      setProducts(filteredProducts);
      
      // Charger les catégories et stats une seule fois
      if (categories.length === 0) {
        setCategories(ProductStorage.getCategories());
        setStats(ProductStorage.getProductStats());
      }
      
    } catch (err) {
      setError("Erreur lors du chargement des produits");
      console.error(err);
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