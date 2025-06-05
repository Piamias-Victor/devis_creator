"use client";

import { useState, useEffect, useCallback } from "react";
import { Client } from "@/types";
import { supabase, handleSupabaseError } from "@/lib/database/supabase";

interface UseClientsReturn {
  clients: Client[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  addClient: (client: Omit<Client, "id" | "createdAt">) => Promise<Client>;
  updateClient: (id: string, updates: Partial<Client>) => Promise<Client | null>;
  deleteClient: (id: string) => Promise<boolean>;
  refreshClients: () => void;
}

/**
 * Hook clients MIGRÉ vers Supabase
 * Remplace complètement ClientStorage
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

      // Transformer pour compatibilité avec l'interface existante
      const transformedClients: Client[] = (data || []).map((c : any )=> ({
        id: c.id,
        nom: c.nom,
        adresse: c.adresse,
        telephone: c.telephone,
        email: c.email,
        siret: c.siret,
        createdAt: new Date(c.created_at || Date.now())
      }));

      setClients(transformedClients);
      
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur chargement clients';
      setError(message);
      console.error('❌ Erreur clients DB:', err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  // Ajouter un client
  const addClient = useCallback(async (clientData: Omit<Client, "id" | "createdAt">): Promise<Client> => {
    try {
      setError(null);
      
      const { data, error } = await supabase
        .from('clients')
        .insert({
          nom: clientData.nom,
          adresse: clientData.adresse,
          telephone: clientData.telephone,
          email: clientData.email,
          siret: clientData.siret
        })
        .select()
        .single();

      if (error) {
        handleSupabaseError(error);
      }

      const newClient: Client = {
        id: data.id,
        nom: data.nom,
        adresse: data.adresse,
        telephone: data.telephone,
        email: data.email,
        siret: data.siret,
        createdAt: new Date(data.created_at)
      };

      // Ajouter à la liste locale immédiatement
      setClients(prev => [newClient, ...prev]);
      
      console.log('✅ Client ajouté en DB:', newClient.nom);
      return newClient;
      
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur ajout client';
      setError(message);
      throw err;
    }
  }, []);

  // Mettre à jour un client
  const updateClient = useCallback(async (id: string, updates: Partial<Client>): Promise<Client | null> => {
    try {
      setError(null);

      const updateData: any = {};
      if (updates.nom) updateData.nom = updates.nom;
      if (updates.adresse) updateData.adresse = updates.adresse;
      if (updates.telephone) updateData.telephone = updates.telephone;
      if (updates.email) updateData.email = updates.email;
      if (updates.siret) updateData.siret = updates.siret;

      const { data, error } = await supabase
        .from('clients')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        handleSupabaseError(error);
      }

      const updatedClient: Client = {
        id: data.id,
        nom: data.nom,
        adresse: data.adresse,
        telephone: data.telephone,
        email: data.email,
        siret: data.siret,
        createdAt: new Date(data.created_at)
      };

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