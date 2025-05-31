"use client";

import { useState, useCallback, useMemo } from "react";
import { DevisLine, Product, DevisCalculations } from "@/types";
import { calculateLineAmounts, calculateDevisTotal } from "@/lib/utils/calculUtils";

interface UseDevisReturn {
  lignes: DevisLine[];
  calculations: DevisCalculations;
  addLine: (product: Product) => void;
  updateLine: (id: string, updates: Partial<DevisLine>) => void;
  deleteLine: (id: string) => void;
  duplicateLine: (id: string) => void;
  clearAll: () => void;
}

/**
 * Hook personnalisé pour la gestion d'état du devis
 * MODIFIÉ avec calculs automatiques temps réel
 */
export function useDevis(initialLignes: DevisLine[] = []): UseDevisReturn {
  const [lignes, setLignes] = useState<DevisLine[]>(
    initialLignes.map(ligne => calculateLineAmounts(ligne))
  );

  // Générer un ID unique pour une ligne
  const generateLineId = useCallback((): string => {
    return `ligne_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Ajouter une ligne depuis un produit
  const addLine = useCallback((product: Product) => {
    const newLine: DevisLine = {
      id: generateLineId(),
      productCode: product.code,
      designation: product.designation,
      quantite: 1,
      prixUnitaire: product.prixVente,
      prixAchat: product.prixAchat,
      remise: 0,
      tva: product.tva,
      colissage: product.colissage
    };
    
    const calculatedLine = calculateLineAmounts(newLine);
    setLignes(prev => [...prev, calculatedLine]);
  }, [generateLineId]);

  // Mettre à jour une ligne avec recalcul automatique
  const updateLine = useCallback((id: string, updates: Partial<DevisLine>) => {
    setLignes(prev => prev.map(ligne => {
      if (ligne.id !== id) return ligne;
      
      const updatedLine = { ...ligne, ...updates };
      return calculateLineAmounts(updatedLine);
    }));
  }, []);

  // Supprimer une ligne
  const deleteLine = useCallback((id: string) => {
    setLignes(prev => prev.filter(ligne => ligne.id !== id));
  }, []);

  // Dupliquer une ligne
  const duplicateLine = useCallback((id: string) => {
    const ligneToClone = lignes.find(l => l.id === id);
    if (!ligneToClone) return;
    
    const clonedLine = calculateLineAmounts({
      ...ligneToClone,
      id: generateLineId(),
    });
    
    setLignes(prev => [...prev, clonedLine]);
  }, [lignes, generateLineId]);

  // Vider toutes les lignes
  const clearAll = useCallback(() => {
    if (lignes.length > 0) {
      if (confirm("Êtes-vous sûr de vouloir supprimer toutes les lignes ?")) {
        setLignes([]);
      }
    }
  }, [lignes.length]);

  // Calculs en temps réel mémorisés
  const calculations = useMemo(() => {
    return calculateDevisTotal(lignes);
  }, [lignes]);

  return {
    lignes,
    calculations,
    addLine,
    updateLine,
    deleteLine,
    duplicateLine,
    clearAll,
  };
}