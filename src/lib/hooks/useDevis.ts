"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { DevisLine, Product, DevisCalculations, Devis, Client } from "@/types";
import { calculateLineAmounts, calculateDevisTotal } from "@/lib/utils/calculUtils";
import { DevisStorage } from "@/lib/storage/devisStorage";

interface UseDevisReturn {
  lignes: DevisLine[];
  calculations: DevisCalculations;
  isDirty: boolean;
  lastSaved: Date | null;
  addLine: (product: Product) => void;
  updateLine: (id: string, updates: Partial<DevisLine>) => void;
  deleteLine: (id: string) => void;
  duplicateLine: (id: string) => void;
  clearAll: () => void;
  saveDevis: (client: Client, numero: string, dateCreation: Date, dateValidite: Date) => Promise<Devis>;
  loadDevis: (devisId: string) => boolean;
  resetDevis: () => void;
}

/**
 * Hook personnalisé pour la gestion d'état du devis
 * AMÉLIORÉ avec sauvegarde/chargement automatique
 */
export function useDevis(initialDevisId?: string): UseDevisReturn {
  const [lignes, setLignes] = useState<DevisLine[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [currentDevisId, setCurrentDevisId] = useState<string | null>(initialDevisId || null);

  // Charger un devis existant au montage
  useEffect(() => {
    if (initialDevisId) {
      loadDevis(initialDevisId);
    }
  }, [initialDevisId]);

  // Générer un ID unique pour une ligne
  const generateLineId = useCallback((): string => {
    return `ligne_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Marquer comme modifié
  const markDirty = useCallback(() => {
    setIsDirty(true);
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
    markDirty();
  }, [generateLineId, markDirty]);

  // Mettre à jour une ligne avec recalcul automatique
  const updateLine = useCallback((id: string, updates: Partial<DevisLine>) => {
    setLignes(prev => prev.map(ligne => {
      if (ligne.id !== id) return ligne;
      
      const updatedLine = { ...ligne, ...updates };
      return calculateLineAmounts(updatedLine);
    }));
    markDirty();
  }, [markDirty]);

  // Supprimer une ligne
  const deleteLine = useCallback((id: string) => {
    setLignes(prev => prev.filter(ligne => ligne.id !== id));
    markDirty();
  }, [markDirty]);

  // Dupliquer une ligne
  const duplicateLine = useCallback((id: string) => {
    const ligneToClone = lignes.find(l => l.id === id);
    if (!ligneToClone) return;
    
    const clonedLine = calculateLineAmounts({
      ...ligneToClone,
      id: generateLineId(),
    });
    
    setLignes(prev => [...prev, clonedLine]);
    markDirty();
  }, [lignes, generateLineId, markDirty]);

  // Vider toutes les lignes
  const clearAll = useCallback(() => {
    if (lignes.length > 0) {
      if (confirm("Êtes-vous sûr de vouloir supprimer toutes les lignes ?")) {
        setLignes([]);
        markDirty();
      }
    }
  }, [lignes.length, markDirty]);

  // Sauvegarder le devis
  const saveDevis = useCallback(async (
    client: Client, 
    numero: string, 
    dateCreation: Date, 
    dateValidite: Date
  ): Promise<Devis> => {
    const calculations = calculateDevisTotal(lignes);
    
    let savedDevis: Devis;
    
    if (currentDevisId) {
      // Mise à jour d'un devis existant
      const updates = {
        lignes,
        totalHT: calculations.totalHT,
        totalTTC: calculations.totalTTC,
        margeGlobale: calculations.margeGlobalePourcent,
        clientId: client.id,
        clientNom: client.nom,
      };
      
      savedDevis = DevisStorage.updateDevis(currentDevisId, updates)!;
    } else {
      // Création d'un nouveau devis
      savedDevis = DevisStorage.addDevis({
        numero,
        date: dateCreation,
        dateValidite,
        client,
        lignes,
        calculations
      });
      
      setCurrentDevisId(savedDevis.id);
    }
    
    setIsDirty(false);
    setLastSaved(new Date());
    
    return savedDevis;
  }, [lignes, currentDevisId]);

  // Charger un devis existant
  const loadDevis = useCallback((devisId: string): boolean => {
    const devis = DevisStorage.getDevisById(devisId);
    if (!devis) return false;
    
    // Recalculer les montants au chargement
    const lignesRecalculees = devis.lignes.map(ligne => calculateLineAmounts(ligne));
    
    setLignes(lignesRecalculees);
    setCurrentDevisId(devis.id);
    setIsDirty(false);
    setLastSaved(devis.updatedAt);
    
    return true;
  }, []);

  // Réinitialiser le devis
  const resetDevis = useCallback(() => {
    setLignes([]);
    setCurrentDevisId(null);
    setIsDirty(false);
    setLastSaved(null);
  }, []);

  // Calculs en temps réel mémorisés
  const calculations = useMemo(() => {
    return calculateDevisTotal(lignes);
  }, [lignes]);

  return {
    lignes,
    calculations,
    isDirty,
    lastSaved,
    addLine,
    updateLine,
    deleteLine,
    duplicateLine,
    clearAll,
    saveDevis,
    loadDevis,
    resetDevis,
  };
}