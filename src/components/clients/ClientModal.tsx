"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils/cn";
import { X } from "lucide-react";
import { ClientForm } from "./ClientForm";
import { Client } from "@/types";

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Client, "id" | "createdAt">) => void;
  client?: Client;
  loading?: boolean;
}

/**
 * Modal glassmorphism pour création/modification client
 * Gestion ESC + overlay + animations
 */
export function ClientModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  client, 
  loading 
}: ClientModalProps) {
  
  // 🐛 DEBUG: Vérifier les props reçues
  useEffect(() => {
    if (isOpen) {
      console.log('🔍 ClientModal ouverte - Props reçues:', {
        isOpen,
        onClose: typeof onClose,
        onSubmit: typeof onSubmit,
        client: client ? `Client: ${client.nom}` : 'Nouveau client',
        loading
      });
    }
  }, [isOpen, onClose, onSubmit, client, loading]);

  // Fonction wrapper pour debug
  const handleSubmit = (data: Omit<Client, "id" | "createdAt">) => {
    console.log('🚀 ClientModal - handleSubmit appelé avec:', data);
    try {
      onSubmit(data);
      console.log('✅ ClientModal - onSubmit exécuté');
    } catch (error) {
      console.error('❌ ClientModal - Erreur dans onSubmit:', error);
    }
  };

  const handleClose = () => {
    console.log('🔍 ClientModal - handleClose appelé');
    onClose();
  };

  // Gestion de la touche ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        console.log('⌨️ ClientModal - Touche ESC pressée');
        onClose();
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // Bloquer le scroll du body quand modal ouverte
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="fixed inset-0 backdrop-blur-sm transition-opacity"
          onClick={handleClose}
        />
        
        {/* Modal content */}
        <div className={cn(
          "relative w-full max-w-2xl transform transition-all",
          "bg-gray-100 backdrop-blur-md border border-gray-200",
          "rounded-2xl shadow-2xl shadow-black/20",
          "supports-[backdrop-filter]:bg-white"
        )}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {client ? "Modifier le client" : "Nouveau client"}
            </h2>
            
            <button
              onClick={handleClose}
              className={cn(
                "p-2 rounded-lg transition-all duration-200",
                "hover:bg-gray-200 text-gray-500 hover:text-gray-700",
                "dark:text-gray-400 dark:hover:text-gray-200"
              )}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Body */}
          <div className="p-6">
            <ClientForm
              client={client}
              onSubmit={handleSubmit}
              onCancel={handleClose}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}