"use client";

import { useState, useEffect, useCallback } from "react";
import { Product, ProductCreateInput } from "@/types/product";
import { ProductStorage } from "@/lib/storage/productStorage";

interface UseProductsCRUDReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: string;
  setSortBy: (field: string) => void;
  ascending: boolean;
  setAscending: (asc: boolean) => void;
  addProduct: (productData: ProductCreateInput) => Promise<void>;
  updateProduct: (code: string, productData: ProductCreateInput) => Promise<void>;
  deleteProduct: (code: string) => Promise<void>;
  exportCSV: () => void;
  stats: {
    total: number;
    margeMoyenne: number;
  };
}

/**
 * Hook CRUD CORRIGÉ - Utilise ProductStorage + simplifiedProducts.ts
 * Compatible avec l'ancien design ProductsManagementPage
 */
export function useProductsCRUD(): UseProductsCRUDReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("designation");
  const [ascending, setAscending] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Initialisation côté client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Chargement des produits CORRIGÉ avec ProductStorage
  const loadProducts = useCallback(() => {
    if (!isClient) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // UTILISER ProductStorage qui gère simplifiedProducts.ts
      let allProducts = ProductStorage.getProducts();
      
      console.log(`📦 ProductStorage chargé: ${allProducts.length} produits`);
      
      // TEST SPÉCIAL pour 165474
      const product165474 = allProducts.find(p => p.code === "165474");
      if (product165474) {
        console.log("✅ Produit 165474 trouvé via ProductStorage:", product165474);
      } else {
        console.log("❌ Produit 165474 NON trouvé");
        console.log("Codes disponibles (premiers 10):", allProducts.slice(0, 10).map(p => p.code));
      }
      
      // Appliquer recherche si query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        allProducts = allProducts.filter(product =>
          product.designation.toLowerCase().includes(query) ||
          product.code.toLowerCase().includes(query) ||
          product.categorie.toLowerCase().includes(query)
        );
        
        console.log(`🔍 Recherche "${searchQuery}": ${allProducts.length} résultats`);
        
        // Test spécial pour 165474
        if (query === "165474") {
          console.log("🔍 Recherche spéciale 165474:", allProducts);
        }
      }
      
      // Appliquer tri
      allProducts.sort((a, b) => {
        let aVal: any = "";
        let bVal: any = "";
        
        switch (sortBy) {
          case "designation":
            aVal = a.designation;
            bVal = b.designation;
            break;
          case "code":
            aVal = a.code;
            bVal = b.code;
            break;
          case "prixVente":
            aVal = a.prixVente;
            bVal = b.prixVente;
            break;
          case "categorie":
            aVal = a.categorie;
            bVal = b.categorie;
            break;
          default:
            aVal = a.designation;
            bVal = b.designation;
        }
        
        if (typeof aVal === "string") {
          return ascending 
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }
        
        return ascending ? aVal - bVal : bVal - aVal;
      });
      
      setProducts(allProducts);
      
    } catch (err) {
      console.error("❌ Erreur chargement produits:", err);
      setError("Erreur lors du chargement des produits");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, sortBy, ascending, isClient]);

  // Effet pour charger les produits
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // CRUD Operations (placeholder pour cohérence)
  const addProduct = useCallback(async (productData: ProductCreateInput) => {
    console.log("➕ Ajout produit (placeholder):", productData);
    // TODO: Implémenter si nécessaire
    loadProducts();
  }, [loadProducts]);

  const updateProduct = useCallback(async (code: string, productData: ProductCreateInput) => {
    console.log("✏️ Modification produit (placeholder):", code, productData);
    // TODO: Implémenter si nécessaire
    loadProducts();
  }, [loadProducts]);

  const deleteProduct = useCallback(async (code: string) => {
    console.log("🗑️ Suppression produit (placeholder):", code);
    // TODO: Implémenter si nécessaire
    loadProducts();
  }, [loadProducts]);

  // Export CSV FONCTIONNEL
  const exportCSV = useCallback(() => {
    const headers = "Code,Designation,Prix Achat,Prix Vente,Categorie,Colissage,TVA";
    const rows = products.map(p => 
      `"${p.code}","${p.designation}",${p.prixAchat},${p.prixVente},${p.colissage},${p.tva}`
    );
    
    const csv = [headers, ...rows].join("\n");
    
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `produits_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    console.log(`📄 Export CSV: ${products.length} produits exportés`);
  }, [products]);

  // Statistiques basées sur ProductStorage
  const stats = {
    total: products.length,
    margeMoyenne: products.length > 0 
      ? products.reduce((sum, p) => {
          const marge = ((p.prixVente || 0 - p.prixAchat) / p.prixAchat) * 100;
          return sum + marge;
        }, 0) / products.length
      : 0
  };

  return {
    products,
    loading,
    error,
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
  };
}