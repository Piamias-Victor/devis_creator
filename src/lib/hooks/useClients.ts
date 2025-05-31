"use client";

import { useState, useEffect, useCallback } from "react";
import { Client } from "@/types";
import { ClientStorage } from "@/lib/storage/clientStorage";

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
 * Hook personnalisé pour la gestion des clients
 * CRUD complet avec recherche et cache local
 */
export function useClients(): UseClientsReturn {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isClient, setIsClient] = useState(false);

  // Initialisation côté client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Chargement initial des clients
  const loadClients = useCallback(() => {
    if (!isClient) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const allClients = ClientStorage.getClients();
      const filteredClients = searchQuery 
        ? ClientStorage.searchClients(searchQuery)
        : allClients;
      
      setClients(filteredClients);
    } catch (err) {
      setError("Erreur lors du chargement des clients");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, isClient]);

  // Effet pour charger les clients au montage et lors de changement de recherche
  useEffect(() => {
    loadClients();
  }, [loadClients]);

  // Ajout d'un nouveau client
  const addClient = useCallback(async (clientData: Omit<Client, "id" | "createdAt">) => {
    try {
      setError(null);
      const newClient = ClientStorage.addClient(clientData);
      loadClients(); // Recharger la liste
      return newClient;
    } catch (err) {
      setError("Erreur lors de l'ajout du client");
      throw err;
    }
  }, [loadClients]);

  // Mise à jour d'un client
  const updateClient = useCallback(async (id: string, updates: Partial<Client>) => {
    try {
      setError(null);
      const updatedClient = ClientStorage.updateClient(id, updates);
      if (updatedClient) {
        loadClients(); // Recharger la liste
      }
      return updatedClient;
    } catch (err) {
      setError("Erreur lors de la mise à jour du client");
      throw err;
    }
  }, [loadClients]);

  // Suppression d'un client
  const deleteClient = useCallback(async (id: string) => {
    try {
      setError(null);
      const success = ClientStorage.deleteClient(id);
      if (success) {
        loadClients(); // Recharger la liste
      }
      return success;
    } catch (err) {
      setError("Erreur lors de la suppression du client");
      throw err;
    }
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
    refreshClients: loadClients,
  };
}