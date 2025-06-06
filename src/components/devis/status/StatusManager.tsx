import { useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils/cn";
import { DevisStatus } from "@/types";
import { StatusBadge } from "./StatusBadge";
import { supabase, handleSupabaseError } from "@/lib/database/supabase";
import { 
  Send, 
  CheckCircle, 
  XCircle, 
  FileText,
  ArrowRight,
  X,
  MessageSquare,
  Clock
} from "lucide-react";

interface StatusManagerProps {
  currentStatus: DevisStatus;
  devisNumero: string;
  devisId: string; // ✅ AJOUT: ID du devis obligatoire
  onStatusChange: (newStatus: DevisStatus, note?: string) => Promise<void>;
  isOpen: boolean;
  onClose: () => void;
  loading?: boolean;
}

/**
 * Manager de transitions CORRIGÉ avec ID devis
 * Gestion directe en base sans dépendre du hook global
 */
export function StatusManager({
  currentStatus,
  devisNumero,
  devisId, // ✅ NOUVEAU paramètre
  onStatusChange,
  isOpen,
  onClose,
  loading
}: StatusManagerProps) {
  const [selectedStatus, setSelectedStatus] = useState<DevisStatus | null>(null);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Actions possibles selon le statut actuel
  const getAvailableTransitions = (status: DevisStatus): DevisStatus[] => {
    switch (status) {
      case 'brouillon':
        return ['envoye'];
      case 'envoye':
        return ['accepte', 'refuse', 'brouillon'];
      case 'accepte':
        return ['brouillon']; // Réouvrir pour modification
      case 'refuse':
        return ['brouillon', 'envoye']; // Réouvrir ou renvoyer
      case 'expire':
        return ['brouillon', 'envoye']; // Réactiver
      default:
        return [];
    }
  };

  // Configuration des actions - COMPLÈTE
  const actionConfig = {
    envoye: {
      label: "Marquer comme envoyé",
      icon: Send,
      color: "blue",
      description: "Le devis a été transmis au client"
    },
    accepte: {
      label: "Marquer comme accepté",
      icon: CheckCircle,
      color: "green",
      description: "Le client a validé et accepté le devis"
    },
    refuse: {
      label: "Marquer comme refusé",
      icon: XCircle,
      color: "red",
      description: "Le client a rejeté le devis"
    },
    brouillon: {
      label: "Remettre en brouillon",
      icon: FileText,
      color: "gray",
      description: "Réouvrir le devis pour modification"
    },
    expire: {
      label: "Marquer comme expiré",
      icon: Clock,
      color: "orange", 
      description: "Le devis a dépassé sa date de validité"
    }
  } as const;

  const availableTransitions = getAvailableTransitions(currentStatus);

  // ✅ NOUVELLE FONCTION: Changement de statut direct en DB
  const handleDirectStatusChange = async (newStatus: DevisStatus, note?: string) => {
    try {
      console.log(`🔄 Changement direct: ${currentStatus} → ${newStatus} pour devis ${devisId}`);

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
          changed_by: 'Utilisateur', // TODO: récupérer depuis session
          note: note || null
        });

      if (historyError) {
        handleSupabaseError(historyError);
      }

      console.log(`✅ Statut changé avec succès: ${newStatus}`);
      
    } catch (err) {
      console.error('❌ Erreur changement statut direct:', err);
      throw err;
    }
  };

  // Gestion de la soumission CORRIGÉE
  const handleSubmit = async () => {
    if (!selectedStatus) return;

    setSubmitting(true);
    try {
      // ✅ CORRECTION: Utiliser la fonction directe au lieu du hook
      await handleDirectStatusChange(selectedStatus, note.trim() || undefined);
      
      // Appeler le callback parent pour rafraîchir l'interface
      await onStatusChange(selectedStatus, note.trim() || undefined);
      
      onClose();
      setSelectedStatus(null);
      setNote("");
    } catch (error) {
      console.error('Erreur changement statut:', error);
      alert('Erreur lors du changement de statut');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[999999] overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="fixed inset-0 backdrop-blur-sm bg-black/40 transition-opacity"
          onClick={onClose}
        />
        
        <div className={cn(
          "relative w-full max-w-lg transform transition-all",
          "bg-white backdrop-blur-md border border-gray-200 rounded-2xl",
          "shadow-2xl shadow-black/20 supports-[backdrop-filter]:bg-white/95"
        )}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Changer le statut
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Devis {devisNumero} • Statut actuel: <StatusBadge status={currentStatus} size="sm" />
              </p>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Body */}
          <div className="p-6 space-y-6">
            {availableTransitions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">
                  Aucune transition disponible depuis ce statut.
                </p>
              </div>
            ) : (
              <>
                {/* Actions disponibles */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Actions disponibles:
                  </h3>
                  <div className="space-y-2">
                    {availableTransitions.map((status) => {
                      const config = actionConfig[status];
                      const Icon = config.icon;
                      const isSelected = selectedStatus === status;
                      
                      return (
                        <button
                          key={status}
                          onClick={() => setSelectedStatus(status)}
                          className={cn(
                            "w-full flex items-center justify-between p-4 rounded-lg border transition-all duration-200",
                            "hover:scale-[1.02] hover:shadow-lg",
                            isSelected ? [
                              config.color === 'blue' && "bg-blue-50 border-blue-300 text-blue-900",
                              config.color === 'green' && "bg-green-50 border-green-300 text-green-900",
                              config.color === 'red' && "bg-red-50 border-red-300 text-red-900",
                              config.color === 'gray' && "bg-gray-50 border-gray-300 text-gray-900",
                              config.color === 'orange' && "bg-orange-50 border-orange-300 text-orange-900"
                            ] : "bg-gray-50 border-gray-200 hover:border-gray-300"
                          )}
                        >
                          <div className="flex items-center space-x-3">
                            <Icon className={cn(
                              "w-5 h-5",
                              config.color === 'blue' && "text-blue-600",
                              config.color === 'green' && "text-green-600",
                              config.color === 'red' && "text-red-600",
                              config.color === 'gray' && "text-gray-600",
                              config.color === 'orange' && "text-orange-600"
                            )} />
                            <div className="text-left">
                              <div className="font-medium">{config.label}</div>
                              <div className="text-sm text-gray-600">{config.description}</div>
                            </div>
                          </div>
                          
                          {isSelected && (
                            <ArrowRight className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Note optionnelle */}
                {selectedStatus && (
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                      <MessageSquare className="w-4 h-4" />
                      <span>Note explicative (optionnelle)</span>
                    </label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Ajoutez une note explicative..."
                      rows={3}
                      className={cn(
                        "w-full px-4 py-3 rounded-lg border border-gray-200",
                        "bg-gray-50 text-gray-900 placeholder-gray-500",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50",
                        "resize-none"
                      )}
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          {selectedStatus && (
            <div className="flex space-x-3 p-6 border-t border-gray-100">
              <button
                onClick={handleSubmit}
                disabled={submitting || loading}
                className={cn(
                  "flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200",
                  "bg-blue-600 hover:bg-blue-700 text-white",
                  "shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "hover:-translate-y-0.5"
                )}
              >
                {submitting ? "Changement..." : "Confirmer le changement"}
              </button>
              
              <button
                onClick={onClose}
                disabled={submitting || loading}
                className={cn(
                  "px-6 py-3 rounded-lg font-medium transition-all duration-200",
                  "bg-gray-100 hover:bg-gray-200 border text-gray-700",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                Annuler
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}