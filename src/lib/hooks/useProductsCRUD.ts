"use client";

import { useState, useCallback } from "react";
import { useProducts } from "./useProducts";
import { supabase, handleSupabaseError } from "@/lib/database/supabase";

interface ProductCreateData {
  code: string;
  designation: string;
  prix_achat: number;
  prix_vente: number;
  tva: number;
  colissage: number;
  categorie_nom?: string;
}

interface UseProductsCRUDReturn extends ReturnType<typeof useProducts> {
  addProduct: (productData: ProductCreateData) => Promise<void>;
  updateProduct: (code: string, productData: Partial<ProductCreateData>) => Promise<void>;
  deleteProduct: (code: string) => Promise<void>;
  exportCSV: () => void;
  crudLoading: boolean;
  crudError: string | null;
}

/**
 * Hook CRUD produits pour la page de gestion
 * Étend useProducts avec fonctions d'administration
 */
export function useProductsCRUD(): UseProductsCRUDReturn {
  const baseHook = useProducts();
  const [crudLoading, setCrudLoading] = useState(false);
  const [crudError, setCrudError] = useState<string | null>(null);

  // Récupérer catégorie par défaut
  const getDefaultCategoryId = useCallback(async (): Promise<string> => {
    const { data } = await supabase
      .from('categories')
      .select('id')
      .eq('nom', 'Incontinence')
      .single();
    
    return data?.id || '';
  }, []);

  // Ajouter un produit
  const addProduct = useCallback(async (productData: ProductCreateData) => {
    try {
      setCrudLoading(true);
      setCrudError(null);

      const categoryId = await getDefaultCategoryId();

      const { error } = await supabase
        .from('produits')
        .insert({
          code: productData.code,
          designation: productData.designation,
          prix_achat: productData.prix_achat,
          prix_vente: productData.prix_vente,
          tva: productData.tva,
          colissage: productData.colissage,
          categorie_id: categoryId
        });

      if (error) {
        handleSupabaseError(error);
      }

      // Recharger la liste
      baseHook.refreshProducts();
      console.log('✅ Produit ajouté en DB:', productData.designation);
      
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur ajout produit';
      setCrudError(message);
      throw err;
    } finally {
      setCrudLoading(false);
    }
  }, [baseHook, getDefaultCategoryId]);

  // Modifier un produit
  const updateProduct = useCallback(async (code: string, productData: Partial<ProductCreateData>) => {
    try {
      setCrudLoading(true);
      setCrudError(null);

      const updateData: any = {};
      if (productData.designation) updateData.designation = productData.designation;
      if (productData.prix_achat !== undefined) updateData.prix_achat = productData.prix_achat;
      if (productData.prix_vente !== undefined) updateData.prix_vente = productData.prix_vente;
      if (productData.tva !== undefined) updateData.tva = productData.tva;
      if (productData.colissage !== undefined) updateData.colissage = productData.colissage;

      const { error } = await supabase
        .from('produits')
        .update(updateData)
        .eq('code', code);

      if (error) {
        handleSupabaseError(error);
      }

      baseHook.refreshProducts();
      console.log('✅ Produit modifié en DB:', code);
      
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur modification produit';
      setCrudError(message);
      throw err;
    } finally {
      setCrudLoading(false);
    }
  }, [baseHook]);

  // Supprimer un produit
  const deleteProduct = useCallback(async (code: string) => {
    try {
      setCrudLoading(true);
      setCrudError(null);

      const { error } = await supabase
        .from('produits')
        .delete()
        .eq('code', code);

      if (error) {
        handleSupabaseError(error);
      }

      baseHook.refreshProducts();
      console.log('✅ Produit supprimé de la DB:', code);
      
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur suppression produit';
      setCrudError(message);
      throw err;
    } finally {
      setCrudLoading(false);
    }
  }, [baseHook]);

  // Export CSV
  const exportCSV = useCallback(() => {
    const headers = "Code,Designation,Prix Achat,Prix Vente,Categorie,Colissage,TVA";
    const rows = baseHook.products.map(p => 
      `"${p.code}","${p.designation}",${p.prixAchat},${p.prixVente},"${p.categorie}",${p.colissage},${p.tva}`
    );
    
    const csv = [headers, ...rows].join("\n");
    
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `produits_supabase_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    console.log(`📄 Export CSV: ${baseHook.products.length} produits exportés`);
  }, [baseHook.products]);

  return {
    ...baseHook,
    addProduct,
    updateProduct,
    deleteProduct,
    exportCSV,
    crudLoading,
    crudError
  };
}