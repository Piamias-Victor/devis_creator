"use client";

import { cn } from "@/lib/utils/cn";
import { Client } from "@/types";
import { Edit, Trash2, Phone, Mail } from "lucide-react";

interface ClientTableProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
  loading?: boolean;
}

/**
 * Table des clients avec glassmorphism
 * Actions inline et responsive desktop
 */
export function ClientTable({ clients, onEdit, onDelete, loading }: ClientTableProps) {
  
  if (loading) {
    return (
      <div className={cn(
        "rounded-xl border border-gray-200 bg-white/5 backdrop-blur-md",
        "p-8 text-center supports-[backdrop-filter]:bg-white/5"
      )}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto" />
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className={cn(
        "rounded-xl border border-gray-200 bg-white/5 backdrop-blur-md",
        "p-12 text-center supports-[backdrop-filter]:bg-white/5"
      )}>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Aucun client trouvé
        </p>
        <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
          Commencez par créer votre premier client
        </p>
      </div>
    );
  }

  return (
    <div className={cn(
      "rounded-xl border border-gray-200 bg-white/5 backdrop-blur-md",
      "overflow-hidden supports-[backdrop-filter]:bg-white/5"
    )}>
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Header */}
          <thead className="bg-gray-100 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                Client
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                Contact
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                SIRET
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                Créé le
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          
          {/* Body */}
          <tbody>
            {clients.map((client, index) => (
              <tr 
                key={client.id}
                className={cn(
                  "transition-colors duration-200",
                  "hover:bg-gray-100 border-b border-white/5 last:border-b-0"
                )}
              >
                {/* Nom et adresse */}
                <td className="px-6 py-4">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {client.nom}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {client.adresse}
                    </p>
                  </div>
                </td>
                
                {/* Contact */}
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {client.telephone}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {client.email}
                      </span>
                    </div>
                  </div>
                </td>
                
                {/* SIRET - MODIFIÉ: Affichage conditionnel */}
                <td className="px-6 py-4">
                  <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
                    {client.siret || (
                      <span className="text-gray-400 italic">Non renseigné</span>
                    )}
                  </span>
                </td>
                
                {/* Date création */}
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(client.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                </td>
                
                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onEdit(client)}
                      className={cn(
                        "p-2 rounded-lg transition-all duration-200",
                        "hover:bg-blue-500/20 text-blue-600 dark:text-blue-400",
                        "hover:shadow-lg hover:shadow-blue-500/20"
                      )}
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => onDelete(client)}
                      className={cn(
                        "p-2 rounded-lg transition-all duration-200",
                        "hover:bg-red-500/20 text-red-600 dark:text-red-400",
                        "hover:shadow-lg hover:shadow-red-500/20"
                      )}
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}