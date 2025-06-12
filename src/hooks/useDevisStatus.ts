import { useState, useCallback } from "react";
import { DevisStatus } from "@/types";
import { supabase, handleSupabaseError } from "@/lib/database/supabase";

export interface StatusChange {
  id: string;
  devis_id: string;
  previous_status: string;
  new_status: string;
  changed_at: string;
  changed_by?: string;
  note?: string;
}

interface UseDevisStatusReturn {
  currentStatus: DevisStatus;
  statusHistory: StatusChange[];
  loading: boolean;
  error: string | null;
  changeStatus: (newStatus: DevisStatus, note?: string) => Promise<void>;
  loadStatusHistory: (devisId: string) => Promise<void>;
  checkExpiredStatus: (dateValidite: Date) => DevisStatus;
}

/**
 * Hook pour gestion complète des statuts de devis
 * Transitions, historique, vérification expiration
 */
export function useDevisStatus(
  initialStatus: DevisStatus = 'brouillon',
  devisId?: string
): UseDevisStatusReturn {
  const [currentStatus, setCurrentStatus] = useState<DevisStatus>(initialStatus);
  const [statusHistory, setStatusHistory] = useState<StatusChange[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger l'historique des statuts depuis Supabase
  const loadStatusHistory = useCallback(async (devisIdToLoad: string) => {
    if (!devisIdToLoad) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: queryError } = await supabase
        .from('devis_status_history')
        .select('*')
        .eq('devis_id', devisIdToLoad)
        .order('changed_at', { ascending: false });

      if (queryError) {
        handleSupabaseError(queryError);
      }

      // ✅ FIX: Transformer les données pour gérer les champs nullable
      const transformedData: StatusChange[] = (data || []).map(item => ({
        id: item.id,
        devis_id: item.devis_id,
        previous_status: item.previous_status,
        new_status: item.new_status,
        changed_at: item.changed_at || new Date().toISOString(), // Fallback si null
        changed_by: item.changed_by || undefined,
        note: item.note || undefined
      }));

      setStatusHistory(transformedData);
      console.log(`✅ ${transformedData.length} changements de statut chargés`);

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur chargement historique';
      setError(message);
      console.error('❌ Erreur historique statut:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Changer le statut avec historique
  const changeStatus = useCallback(async (newStatus: DevisStatus, note?: string) => {
    if (!devisId) {
      throw new Error('ID devis requis pour changer le statut');
    }

    if (newStatus === currentStatus) {
      console.log('ℹ️ Statut identique, pas de changement');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log(`🔄 Changement statut: ${currentStatus} → ${newStatus}`);

      // 1. Mettre à jour le statut principal du devis
      const { error: updateError } = await supabase
        .from('devis')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', devisId);

      if (updateError) {
        handleSupabaseError(updateError);
      }

      // 2. Ajouter à l'historique
      const { error: historyError } = await supabase
        .from('devis_status_history')
        .insert({
          devis_id: devisId,
          previous_status: currentStatus,
          new_status: newStatus,
          changed_at: new Date().toISOString(),
          changed_by: 'Utilisateur actuel', // TODO: récupérer depuis session
          note: note || null
        });

      if (historyError) {
        handleSupabaseError(historyError);
      }

      // 3. Mettre à jour l'état local
      setCurrentStatus(newStatus);

      // 4. Recharger l'historique
      await loadStatusHistory(devisId);

      console.log(`✅ Statut changé vers: ${newStatus}`);

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur changement statut';
      setError(message);
      console.error('❌ Erreur changement statut:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentStatus, devisId, loadStatusHistory]);

  // Vérifier si le devis est expiré selon la date
  const checkExpiredStatus = useCallback((dateValidite: Date): DevisStatus => {
    const now = new Date();
    const isExpired = now > dateValidite;
    
    // Si expiré et pas encore marqué comme tel
    if (isExpired && currentStatus === 'envoye') {
      return 'expire';
    }
    
    return currentStatus;
  }, [currentStatus]);

  // Auto-update du statut si devis chargé
  useState(() => {
    if (devisId) {
      loadStatusHistory(devisId);
    }
  });

  return {
    currentStatus,
    statusHistory,
    loading,
    error,
    changeStatus,
    loadStatusHistory,
    checkExpiredStatus
  };
}

/**
 * Utilitaires pour validation des transitions
 */
export class StatusTransitionValidator {
  
  // Valider si une transition est autorisée
  static isTransitionAllowed(from: DevisStatus, to: DevisStatus): boolean {
    const allowedTransitions: Record<DevisStatus, DevisStatus[]> = {
      brouillon: ['envoye'],
      envoye: ['accepte', 'refuse', 'brouillon', 'expire'],
      accepte: ['brouillon'], // Réouvrir pour modification
      refuse: ['brouillon', 'envoye'], // Réouvrir ou renvoyer
      expire: ['brouillon', 'envoye'] // Réactiver
    };

    return allowedTransitions[from]?.includes(to) || false;
  }

  // Obtenir les transitions disponibles
  static getAvailableTransitions(from: DevisStatus): DevisStatus[] {
    const transitions: Record<DevisStatus, DevisStatus[]> = {
      brouillon: ['envoye'],
      envoye: ['accepte', 'refuse', 'brouillon'],
      accepte: ['brouillon'],
      refuse: ['brouillon', 'envoye'],
      expire: ['brouillon', 'envoye']
    };

    return transitions[from] || [];
  }

  // Vérifier si un statut est final
  static isFinalStatus(status: DevisStatus): boolean {
    return ['accepte', 'refuse'].includes(status);
  }

  // Vérifier si un statut permet modification
  static allowsModification(status: DevisStatus): boolean {
    return status === 'brouillon';
  }
}