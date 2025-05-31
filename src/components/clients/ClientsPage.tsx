"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { Plus, Search, Users } from "lucide-react";
import { useClients } from "@/lib/hooks/useClients";
import { ClientTable } from "./ClientTable";
import { ClientModal } from "./ClientModal";
import { Client } from "@/types";

/**
 * Page principale de gestion des clients
 * Recherche + Table + Modal création/modification
 */
export function ClientsPage() {
  const {
    clients,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    addClient,
    updateClient,
    deleteClient,
  } = useClients();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Ouvrir modal création
  const handleCreate = () => {
    setEditingClient(null);
    setIsModalOpen(true);
  };

  // Ouvrir modal modification
  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  // Supprimer client avec confirmation
  const handleDelete = async (client: Client) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${client.nom}" ?`)) {
      return;
    }

    try {
      await deleteClient(client.id);
    } catch (error) {
      alert("Erreur lors de la suppression");
    }
  };

  // Soumettre formulaire modal
  const handleSubmit = async (data: Omit<Client, "id" | "createdAt">) => {
    setModalLoading(true);
    
    try {
      if (editingClient) {
        await updateClient(editingClient.id, data);
      } else {
        await addClient(data);
      }
      setIsModalOpen(false);
      setEditingClient(null);
    } catch (error) {
      alert("Erreur lors de l'enregistrement");
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header avec recherche */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={cn(
            "p-3 rounded-lg",
            "bg-gradient-to-br from-blue-500/20 to-purple-600/20",
            "border border-gray100 backdrop-blur-sm"
          )}>
            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Gestion des clients
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {clients.length} client{clients.length > 1 ? "s" : ""} enregistré{clients.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <button
          onClick={handleCreate}
          className={cn(
            "flex items-center space-x-2 px-6 py-3 rounded-lg",
            "bg-blue-600 hover:bg-blue-700 text-white",
            "transition-all duration-200 font-medium",
            "shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30",
            "hover:-translate-y-0.5"
          )}
        >
          <Plus className="w-5 h-5" />
          <span>Nouveau client</span>
        </button>
      </div>

      {/* Barre de recherche */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-gray-500" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher par nom, SIRET ou adresse..."
          className={cn(
            "w-full pl-12 pr-4 py-3 rounded-lg transition-all duration-200",
            "bg-gray-100 backdrop-blur-sm border border-gray-200",
            "text-gray-900 dark:text-gray-100 placeholder-gray-500",
            "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
          )}
        />
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className={cn(
          "p-4 rounded-lg border",
          "bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-300"
        )}>
          {error}
        </div>
      )}

      {/* Table des clients */}
      <ClientTable
        clients={clients}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modal création/modification */}
      <ClientModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingClient(null);
        }}
        onSubmit={handleSubmit}
        client={editingClient || undefined}
        loading={modalLoading}
      />
    </div>
  );
}