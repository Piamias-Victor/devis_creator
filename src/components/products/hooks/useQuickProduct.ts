"use client";

import { useState, useEffect, useCallback } from "react";
import { Product } from "@/types";
import { supabase, handleSupabaseError } from "@/lib/database/supabase";

interface QuickProductData {
  code: string;
  designation: string;
  prixAchat: number;
  tva: number;
  colissage: number;
}

interface UseQuickProductProps {
  isOpen: boolean;
  onClose: () => void;
  onProductCreated: (product: Product) => void;
  suggestedCode: string;
}

/**
 * Hook logique création rapide produit
 * Gestion état + validation + création Supabase < 70 lignes
 */
export function useQuickProduct({
  isOpen,
  onClose,
  onProductCreated,
  suggestedCode
}: UseQuickProductProps) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // Gestion ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      return () => document.removeEventListener("keydown", handleEsc);
    }
  }, [isOpen, onClose]);

  // Validation
  const validateForm = (data: QuickProductData): boolean => {
    const newErrors: string[] = [];
    if (!data.code.trim()) newErrors.push("Le code produit est obligatoire");
    if (!data.designation.trim()) newErrors.push("La désignation est obligatoire");
    if (!data.prixAchat || data.prixAchat <= 0) newErrors.push("Le prix d'achat doit être supérieur à 0");
    if (data.tva < 0 || data.tva > 100) newErrors.push("La TVA doit être entre 0 et 100%");
    if (!data.colissage || data.colissage < 1) newErrors.push("Le colissage doit être d'au moins 1");
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  // Création produit avec Supabase
  const handleProductCreation = useCallback(async (data: QuickProductData) => {
    if (!validateForm(data)) return;
    
    setLoading(true);
    setErrors([]);
    
    try {
      // Récupérer catégorie par défaut
      const { data: defaultCategory } = await supabase
        .from('categories')
        .select('id')
        .eq('nom', 'Incontinence')
        .single();

      if (!defaultCategory) throw new Error('Catégorie par défaut introuvable');

      // Prix de vente avec marge 10%
      const prixVente = data.prixAchat * 1.10;

      // Créer produit
      const { data: newProductDB, error } = await supabase
        .from('produits')
        .insert({
          code: data.code.trim(),
          designation: data.designation.trim(),
          prix_achat: Number(data.prixAchat),
          prix_vente: Number(prixVente),
          tva: Number(data.tva),
          colissage: Number(data.colissage),
          categorie_id: defaultCategory.id
        })
        .select('*, categories(nom)')
        .single();

      if (error) handleSupabaseError(error);

      // Transformer pour interface
      const newProduct: Product = {
        code: newProductDB.code,
        designation: newProductDB.designation,
        prixAchat: Number(newProductDB.prix_achat),
        prixVente: Number(newProductDB.prix_vente),
        tva: Number(newProductDB.tva),
        colissage: newProductDB.colissage,
        categorie: newProductDB.categories?.nom || 'Incontinence',
        unite: newProductDB.designation.toLowerCase().includes('bte') ? 'boîte' : 'pièce'
      };

      console.log('✅ Produit créé en Supabase:', newProduct);
      onClose();
      onProductCreated(newProduct);
      
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur création produit";
      setErrors([message]);
    } finally {
      setLoading(false);
    }
  }, [onClose, onProductCreated]);

  return {
    handleProductCreation,
    loading,
    errors
  };
}