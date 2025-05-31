"use client";

import { useState, useCallback } from "react";
import { DevisLine, Product } from "@/types";
import { calculateLineTotal } from "@/lib/utils/devisUtils";

interface UseDevisReturn {
  lignes: DevisLine[];
  remiseGlobale: number;
  setRemiseGlobale: (remise: number) => void;
  addLine: (product: Product) => void;
  updateLine: (id: string, updates: Partial<DevisLine>) => void;
  deleteLine: (id: string) => void;
  duplicateLine: (id: string) => void;
  clearAll: () => void;
  totals: {
    totalHT: number;
    totalTVA: number;
    totalTTC: number;
    nombreLignes: number;
    quantiteTotale: number;
  };
}

/**
 * Hook personnalisé pour la gestion d'état du devis
 * Logique métier centralisée et optimisée
 */
export function useDevis(initialLignes: DevisLine[] = []): UseDevisReturn {
  const [lignes, setLignes] = useState<DevisLine[]>(initialLignes);
  const [remiseGlobale, setRemiseGlobale] = useState<number>(0);

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
      prixUnitaire: product.prixVente, // Prix de vente = prix HT affiché
      prixAchat: product.prixAchat, // Pour calcul marge
      remise: 0,
      tva: product.tva,
      colissage: product.colissage // Pour calcul nb colis
    };
    
    setLignes(prev => [...prev, newLine]);
  }, [generateLineId]);

  // Mettre à jour une ligne
  const updateLine = useCallback((id: string, updates: Partial<DevisLine>) => {
    setLignes(prev => prev.map(ligne => 
      ligne.id === id ? { ...ligne, ...updates } : ligne
    ));
  }, []);

  // Supprimer une ligne
  const deleteLine = useCallback((id: string) => {
    setLignes(prev => prev.filter(ligne => ligne.id !== id));
  }, []);

  // Dupliquer une ligne
  const duplicateLine = useCallback((id: string) => {
    const ligneToClone = lignes.find(l => l.id === id);
    if (!ligneToClone) return;
    
    const clonedLine: DevisLine = {
      ...ligneToClone,
      id: generateLineId(),
    };
    
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

  // Calculs en temps réel
  const totals = {
    totalHT: lignes.reduce((sum, ligne) => {
      return sum + calculateLineTotal(ligne.quantite, ligne.prixUnitaire, ligne.remise);
    }, 0),
    
    totalTVA: lignes.reduce((sum, ligne) => {
      const ligneHT = calculateLineTotal(ligne.quantite, ligne.prixUnitaire, ligne.remise);
      return sum + (ligneHT * ligne.tva / 100);
    }, 0),
    
    get totalTTC() {
      return this.totalHT + this.totalTVA;
    },
    
    nombreLignes: lignes.length,
    
    quantiteTotale: lignes.reduce((sum, ligne) => sum + ligne.quantite, 0)
  };

  return {
    lignes,
    remiseGlobale,
    setRemiseGlobale,
    addLine,
    updateLine,
    deleteLine,
    duplicateLine,
    clearAll,
    totals,
  };
}