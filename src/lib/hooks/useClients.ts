"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Client, 
  ClientCreateInput 
} from "@/types";
import { supabase, handleSupabaseError } from "@/lib/database/supabase";

interface UseClientsReturn {
  clients: Client[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  addClient: (client: ClientCreateInput) => Promise<Client>;
  updateClient: (id: string, updates: Partial<ClientCreateInput>) => Promise<Client | null>;
  deleteClient: (id: string) => Promise<boolean>;
  refreshClients: () => void;
}

// ✅ FIX: Fonction de transformation qui gère les types nullable
const transformClientFromSupabase = (clientData: any): Client => {
  return {
    id: clientData.id,
    nom: clientData.nom,
    adresse: clientData.adresse,
    telephone: clientData.telephone,
    email: clientData.email,
    siret: clientData.siret || undefined, // MODIFIÉ: Gérer null/undefined
    createdAt: new Date(clientData.created_at || new Date().toISOString()) // Fallback si null
  };
};

/**
 * Hook clients UNIFIÉ avec types standardisés
 * Source unique pour tous les clients Supabase
 */
export function useClients(): UseClientsReturn {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Charger clients depuis Supabase avec recherche
  const loadClients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('clients')
        .select('*')
        .order('nom', { ascending: true });

      // Recherche en temps réel
      if (searchQuery.trim()) {
        const searchTerm = `%${searchQuery.trim()}%`;
        query = query.or(`nom.ilike.${searchTerm},siret.ilike.${searchTerm},email.ilike.${searchTerm},adresse.ilike.${searchTerm}`);
      }

      const { data, error: queryError } = await query;

      if (queryError) {
        handleSupabaseError(queryError);
      }

      // ✅ FIX: Utiliser la fonction de transformation corrigée
      const transformedClients: Client[] = (data || []).map(transformClientFromSupabase);

      setClients(transformedClients);
      
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur chargement clients';
      setError(message);
      console.error('❌ Erreur clients DB:', err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  // Ajouter un client - MODIFIÉ pour gérer SIRET optionnel
  const addClient = useCallback(async (clientData: ClientCreateInput): Promise<Client> => {
    try {
      setError(null);
      
      console.log('🔄 Ajout client DB:', clientData);
      
      // MODIFIÉ: Gérer le SIRET optionnel correctement
      const insertData: any = {
        nom: clientData.nom,
        adresse: clientData.adresse,
        telephone: clientData.telephone,
        email: clientData.email,
        siret: clientData.siret || null // IMPORTANT: null au lieu d'undefined pour Supabase
      };
      
      const { data, error } = await supabase
        .from('clients')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('❌ Erreur Supabase insert:', error);
        handleSupabaseError(error);
      }

      // ✅ FIX: Utiliser la fonction de transformation corrigée
      const newClient = transformClientFromSupabase(data);

      // Ajouter à la liste locale immédiatement
      setClients(prev => [newClient, ...prev]);
      
      console.log('✅ Client ajouté en DB:', newClient.nom);
      return newClient;
      
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur ajout client';
      setError(message);
      console.error('❌ Erreur addClient complète:', err);
      throw err;
    }
  }, []);

  // Mettre à jour un client - MODIFIÉ pour gérer SIRET optionnel
  const updateClient = useCallback(async (id: string, updates: Partial<ClientCreateInput>): Promise<Client | null> => {
    try {
      setError(null);

      // MODIFIÉ: Construction des données de mise à jour
      const updateData: any = {};
      if (updates.nom !== undefined) updateData.nom = updates.nom;
      if (updates.adresse !== undefined) updateData.adresse = updates.adresse;
      if (updates.telephone !== undefined) updateData.telephone = updates.telephone;
      if (updates.email !== undefined) updateData.email = updates.email;
      // IMPORTANT: Gérer SIRET optionnel - null si vide
      if (updates.siret !== undefined) {
        updateData.siret = updates.siret || null;
      }

      const { data, error } = await supabase
        .from('clients')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        handleSupabaseError(error);
      }

      // ✅ FIX: Utiliser la fonction de transformation corrigée
      const updatedClient = transformClientFromSupabase(data);

      // Mettre à jour la liste locale
      setClients(prev => prev.map(c => c.id === id ? updatedClient : c));
      
      console.log('✅ Client modifié en DB:', updatedClient.nom);
      return updatedClient;
      
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur modification client';
      setError(message);
      throw err;
    }
  }, []);

  // Supprimer un client
  const deleteClient = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);

      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) {
        handleSupabaseError(error);
      }

      // Supprimer de la liste locale
      setClients(prev => prev.filter(c => c.id !== id));
      
      console.log('✅ Client supprimé de la DB');
      return true;
      
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur suppression client';
      setError(message);
      return false;
    }
  }, []);

  // Charger au montage et quand recherche change
  useEffect(() => {
    loadClients();
  }, [loadClients]);

  return {
    clients,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    addClient,
    updateClient,
    deleteClient,
    refreshClients: loadClients
  };
}