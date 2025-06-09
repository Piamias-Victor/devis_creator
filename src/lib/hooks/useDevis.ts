"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { DevisLine, Product, DevisCalculations, Client } from "@/types";
import { calculateLineAmounts, calculateDevisTotal } from "@/lib/utils/calculUtils";
import { DevisRepository } from "@/lib/repositories/devisRepository";
import { useAuth } from "./useAuth"; // ✅ AJOUTÉ pour traçabilité

interface UseDevisReturn {
  lignes: DevisLine[];
  calculations: DevisCalculations;
  loading: boolean;
  saving: boolean;
  error: string | null;
  isDirty: boolean;
  lastSaved: Date | null;
  devisId: string | null;
  addLine: (product: Product) => void;
  updateLine: (id: string, updates: Partial<DevisLine>) => void;
  deleteLine: (id: string) => void;
  duplicateLine: (id: string) => void;
  clearAll: () => void;
  saveDevis: (client: Client, dateValidite: Date, notes?: string) => Promise<string>;
  loadDevis: (devisId: string) => Promise<boolean>;
  resetDevis: () => void;
}

/**
 * Hook devis AVEC AUTHENTIFICATION UTILISATEUR
 * Traçabilité automatique des créateurs/modificateurs
 */
export function useDevis(initialDevisId?: string): UseDevisReturn {
  const [lignes, setLignes] = useState<DevisLine[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devisId, setDevisId] = useState<string | null>(initialDevisId || null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // ✅ HOOK AUTHENTIFICATION pour traçabilité
  const { currentUser } = useAuth();

  // Générer un ID unique pour une ligne
  const generateLineId = useCallback((): string => {
    return `ligne_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Charger un devis existant CORRIGÉ
  const loadDevis = useCallback(async (devisIdToLoad: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Chargement devis depuis Supabase:', devisIdToLoad);

      const devis = await DevisRepository.getDevisById(devisIdToLoad);
      
      if (!devis) {
        setError("Devis introuvable");
        return false;
      }

      console.log('✅ Devis trouvé:', devis.numero, 'avec', devis.lignes.length, 'lignes');
      
      // Recalculer les lignes pour s'assurer de la cohérence
      const lignesRecalculees = devis.lignes.map(ligne => calculateLineAmounts(ligne));
      
      setLignes(lignesRecalculees);
      setDevisId(devis.id);
      setLastSaved(devis.updatedAt);
      
      console.log('✅ Devis chargé avec', lignesRecalculees.length, 'lignes recalculées');
      return true;

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur chargement';
      setError(message);
      console.error('❌ Erreur chargement devis:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // NOUVEAU : Chargement automatique au montage
  useEffect(() => {
    if (initialDevisId) {
      console.log('🚀 Chargement automatique devis au montage:', initialDevisId);
      loadDevis(initialDevisId);
    }
  }, [initialDevisId, loadDevis]);

  // Ajouter une ligne depuis un produit
  const addLine = useCallback((product: Product) => {
    const newLine: DevisLine = {
      id: generateLineId(),
      productCode: product.code,
      designation: product.designation,
      quantite: 1,
      prixUnitaire: product.prixVente || 0,
      prixAchat: product.prixAchat,
      remise: 0,
      tva: product.tva,
      colissage: product.colissage
    };
    
    const calculatedLine = calculateLineAmounts(newLine);
    setLignes(prev => [...prev, calculatedLine]);
    setError(null);
  }, [generateLineId]);

  // Mettre à jour une ligne avec recalcul
  const updateLine = useCallback((id: string, updates: Partial<DevisLine>) => {
    setLignes(prev => prev.map(ligne => {
      if (ligne.id !== id) return ligne;
      
      const updatedLine = { ...ligne, ...updates };
      return calculateLineAmounts(updatedLine);
    }));
    setError(null);
  }, []);

  // Supprimer une ligne
  const deleteLine = useCallback((id: string) => {
    setLignes(prev => prev.filter(ligne => ligne.id !== id));
    setError(null);
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
    setError(null);
  }, [lignes, generateLineId]);

  // Vider toutes les lignes
  const clearAll = useCallback(() => {
    if (lignes.length > 0) {
      if (confirm("Êtes-vous sûr de vouloir supprimer toutes les lignes ?")) {
        setLignes([]);
        setError(null);
      }
    }
  }, [lignes.length]);

  // ✅ SAUVEGARDER DEVIS AVEC AUTHENTIFICATION
  const saveDevis = useCallback(async (
    client: Client,
    dateValidite: Date,
    notes?: string
  ): Promise<string> => {
    try {
      setSaving(true);
      setError(null);

      if (lignes.length === 0) {
        throw new Error("Impossible de sauvegarder un devis vide");
      }

      // ✅ VÉRIFIER QUE L'UTILISATEUR EST CONNECTÉ
      if (!currentUser) {
        throw new Error("Vous devez être connecté pour sauvegarder un devis");
      }

      const calculations = calculateDevisTotal(lignes);
      const now = new Date();

      const devisData = {
        numero: devisId ? undefined : DevisRepository.generateNumeroDevis(),
        client_id: client.id,
        date_creation: now.toISOString().split('T')[0],
        date_validite: dateValidite.toISOString().split('T')[0],
        lignes,
        total_ht: calculations.totalHT,
        total_tva: calculations.totalTVA,
        total_ttc: calculations.totalTTC,
        marge_globale_euros: calculations.margeGlobaleEuros,
        marge_globale_pourcent: calculations.margeGlobalePourcent,
        notes,
        created_by: currentUser.id // ✅ TRAÇABILITÉ UTILISATEUR
      };

      let savedDevisId: string;

      if (devisId) {
        // ✅ Mise à jour avec utilisateur modificateur
        await DevisRepository.updateDevis(devisId, devisData, currentUser.id);
        savedDevisId = devisId;
        console.log('✅ Devis mis à jour par:', currentUser.fullName);
      } else {
        // ✅ Création avec utilisateur créateur
        savedDevisId = await DevisRepository.createDevis(devisData as any);
        setDevisId(savedDevisId);
        console.log('✅ Nouveau devis créé par:', currentUser.fullName);
      }

      setLastSaved(new Date());
      return savedDevisId;

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur sauvegarde';
      setError(message);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [lignes, devisId, currentUser]); // ✅ currentUser dans dépendances

  // Réinitialiser le devis
  const resetDevis = useCallback(() => {
    setLignes([]);
    setDevisId(null);
    setLastSaved(null);
    setError(null);
  }, []);

  // Calculs en temps réel
  const calculations = useMemo(() => {
    return calculateDevisTotal(lignes);
  }, [lignes]);

  // isDirty = true si modifications depuis dernière sauvegarde
  const isDirty = lignes.length > 0 && (!lastSaved || !devisId);

  return {
    lignes,
    calculations,
    loading,
    saving,
    error,
    isDirty,
    lastSaved,
    devisId,
    addLine,
    updateLine,
    deleteLine,
    duplicateLine,
    clearAll,
    saveDevis,
    loadDevis,
    resetDevis
  };
}