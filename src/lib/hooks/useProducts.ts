"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Product, 
  ProductStats, 
  ProductFilters,
  transformProductFromDB 
} from "@/types";
import { supabase, handleSupabaseError } from "@/lib/database/supabase";

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategory: string;
  categories: string[];
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  getProductByCode: (code: string) => Product | null;
  refreshProducts: () => void;
  stats: ProductStats;
}

/**
 * Hook produits UNIFIÉ avec types standardisés
 * Source unique pour tous les produits Supabase
 */
export function useProducts(): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);

  // Charger TOUS les produits depuis Supabase
  const loadAllProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: queryError } = await supabase
        .from('produits')
        .select(`
          *,
          categories(nom, color)
        `)
        .order('designation', { ascending: true });

      if (queryError) {
        handleSupabaseError(queryError);
      }

      // Transformer avec la fonction unifiée
      const transformedProducts: Product[] = (data || []).map((p: any) => 
        transformProductFromDB(p, p.categories?.nom || 'Incontinence')
      );

      setAllProducts(transformedProducts);
      
      // Extraire catégories uniques
      const uniqueCategories = [...new Set(transformedProducts.map(p => p.categorie))];
      setCategories(uniqueCategories.sort());
      
      console.log(`✅ ${transformedProducts.length} produits chargés depuis Supabase`);
      
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur chargement produits';
      setError(message);
      console.error('❌ Erreur produits DB:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filtrer produits selon recherche + catégorie
  const filterProducts = useCallback(() => {
    let filtered = [...allProducts];

    // Filtre par recherche (nom ou code)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(p =>
        p.designation.toLowerCase().includes(query) ||
        p.code.toLowerCase().includes(query)
      );
    }

    // Filtre par catégorie
    if (selectedCategory) {
      filtered = filtered.filter(p => p.categorie === selectedCategory);
    }

    setProducts(filtered);
  }, [allProducts, searchQuery, selectedCategory]);

  // Récupérer un produit par code
  const getProductByCode = useCallback((code: string): Product | null => {
    return allProducts.find(p => p.code === code) || null;
  }, [allProducts]);

  // Calcul des statistiques avec types unifiés
  const stats: ProductStats = {
    total: allProducts.length,
    categories: categories.length,
    margeGlobaleMoyenne: allProducts.length > 0 
      ? allProducts.reduce((sum, p) => {
          const marge = ((p.prixVente - p.prixAchat) / p.prixAchat) * 100;
          return sum + marge;
        }, 0) / allProducts.length
      : 0,
    prixMoyen: allProducts.length > 0
      ? allProducts.reduce((sum, p) => sum + p.prixVente, 0) / allProducts.length
      : 0
  };

  // Charger tous les produits au montage
  useEffect(() => {
    loadAllProducts();
  }, [loadAllProducts]);

  // Filtrer quand recherche/catégorie change
  useEffect(() => {
    filterProducts();
  }, [filterProducts]);

  return {
    products,
    loading,
    error,
    searchQuery,
    selectedCategory,
    categories,
    setSearchQuery,
    setSelectedCategory,
    getProductByCode,
    refreshProducts: loadAllProducts,
    stats
  };
}