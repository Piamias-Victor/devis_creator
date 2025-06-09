"use client";

import { useState, useEffect, useCallback } from "react";
import { Devis } from "@/types";
import { DevisRepository } from "@/lib/repositories/devisRepository";
import { useAuth } from "./useAuth"; // ✅ AJOUTÉ pour traçabilité utilisateur

interface UseDevisListReturn {
  devis: Devis[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  statusFilter: string;
  duplicateDevis: (id: string) => Promise<string | null>;
  stats: {
    total: number;
    brouillons: number;
    envoyes: number;
    acceptes: number;
    refuses: number;
    chiffreAffaireMensuel: number;
    margeGlobaleMoyenne: number;
  };
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
  deleteDevis: (id: string) => Promise<boolean>;
  refreshDevis: () => void;
}

/**
 * Hook pour la gestion de la liste des devis AVEC AUTHENTIFICATION
 * Traçabilité automatique des duplications par utilisateur connecté
 */
export function useDevisList(): UseDevisListReturn {
  // ✅ HOOK AUTHENTIFICATION pour traçabilité
  const { currentUser } = useAuth();
  
  const [allDevis, setAllDevis] = useState<Devis[]>([]);
  const [devis, setDevis] = useState<Devis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    brouillons: 0,
    envoyes: 0,
    acceptes: 0,
    refuses: 0,
    chiffreAffaireMensuel: 0,
    margeGlobaleMoyenne: 0
  });

  // Charger tous les devis depuis Supabase
  const loadAllDevis = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [devisData, statsData] = await Promise.all([
        DevisRepository.getAllDevis(),
        DevisRepository.getDevisStats()
      ]);

      setAllDevis(devisData);
      setStats(statsData);
      
      console.log(`✅ ${devisData.length} devis chargés depuis Supabase`);

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur chargement devis';
      setError(message);
      console.error('❌ Erreur chargement devis:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filtrer les devis selon recherche et statut
  const filterDevis = useCallback(() => {
    let filtered = [...allDevis];

    // Filtre par recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(d =>
        d.numero.toLowerCase().includes(query) ||
        d.clientNom?.toLowerCase().includes(query)
      );
    }

    // Filtre par statut
    if (statusFilter) {
      filtered = filtered.filter(d => d.status === statusFilter);
    }

    setDevis(filtered);
  }, [allDevis, searchQuery, statusFilter]);

  // Supprimer un devis
  const deleteDevis = useCallback(async (id: string): Promise<boolean> => {
    try {
      const success = await DevisRepository.deleteDevis(id);
      if (success) {
        // Supprimer de la liste locale
        setAllDevis(prev => prev.filter(d => d.id !== id));
        
        // Recharger les stats
        const newStats = await DevisRepository.getDevisStats();
        setStats(newStats);
      }
      return success;
    } catch (error) {
      setError('Erreur lors de la suppression');
      return false;
    }
  }, []);

  // ✅ FONCTION DUPLICATION AVEC UTILISATEUR ACTUEL
  const duplicateDevis = useCallback(async (id: string): Promise<string | null> => {
    try {
      setError(null);
      
      // ✅ VÉRIFIER QUE L'UTILISATEUR EST CONNECTÉ
      if (!currentUser) {
        setError('Vous devez être connecté pour dupliquer un devis');
        console.warn('❌ Tentative duplication sans utilisateur connecté');
        return null;
      }
      
      console.log('🔄 Duplication devis par:', currentUser.fullName);
      
      // ✅ UTILISER LA NOUVELLE FONCTION avec utilisateur actuel
      const newDevisId = await DevisRepository.duplicateDevisWithCurrentUser(id, currentUser.id);
      
      if (newDevisId) {
        // Recharger la liste pour voir le nouveau devis
        await loadAllDevis();
        console.log('✅ Devis dupliqué avec succès par:', currentUser.fullName, 'ID:', newDevisId);
      } else {
        setError('Erreur lors de la duplication du devis');
      }
      
      return newDevisId;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur lors de la duplication';
      setError(message);
      console.error('❌ Erreur duplication:', error);
      return null;
    }
  }, [currentUser, loadAllDevis]);

  // Charger au montage
  useEffect(() => {
    loadAllDevis();
  }, [loadAllDevis]);

  // Filtrer quand recherche/statut change
  useEffect(() => {
    filterDevis();
  }, [filterDevis]);

  return {
    devis,
    loading,
    error,
    searchQuery,
    statusFilter,
    stats,
    setSearchQuery,
    setStatusFilter,
    deleteDevis,
    duplicateDevis, // ✅ Fonction avec authentification
    refreshDevis: loadAllDevis
  };
}