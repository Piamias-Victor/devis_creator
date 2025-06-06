"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/devisUtils";
import { useDevisList } from "@/lib/hooks/useDevisList";
import { useDevisStatus } from "@/hooks/useDevisStatus";
import { StatusBadge } from "@/components/devis/status/StatusBadge";
import { StatusManager } from "@/components/devis/status/StatusManager";
import { StatusHistory } from "@/components/devis/status/StatusHistory";
import { 
  FileText, 
  Plus, 
  Search, 
  Edit, 
  Copy, 
  Trash2, 
  Filter,
  Settings,
  History,
  Clock,
  X
} from "lucide-react";

/**
 * Page de liste AVEC GESTION COMPLÈTE DES STATUTS
 * Changements de statut + historique + filtres
 */
export function DevisListPage() {
  const router = useRouter();
  
  const {
    devis,
    loading,
    error,
    searchQuery,
    statusFilter,
    stats,
    setSearchQuery,
    setStatusFilter,
    deleteDevis,
    refreshDevis,
    duplicateDevis
  } = useDevisList();

  // États pour gestion des statuts
  const [statusManagerOpen, setStatusManagerOpen] = useState(false);
  const [statusHistoryOpen, setStatusHistoryOpen] = useState(false);
  const [selectedDevisId, setSelectedDevisId] = useState<string | null>(null);
  const [selectedDevisStatus, setSelectedDevisStatus] = useState<string>('brouillon');
  const [selectedDevisNumero, setSelectedDevisNumero] = useState<string>('');

  // Hook de gestion des statuts - CORRIGÉ avec devis sélectionné
  const { changeStatus, statusHistory, loadStatusHistory, loading: statusLoading } = useDevisStatus(
    selectedDevisStatus as any, 
    selectedDevisId || undefined // ✅ CORRECTION: Passer l'ID du devis sélectionné
  );

  // Ouvrir le gestionnaire de statuts
  const handleOpenStatusManager = (devisItem: any) => {
    setSelectedDevisId(devisItem.id);
    setSelectedDevisStatus(devisItem.status);
    setSelectedDevisNumero(devisItem.numero);
    setStatusManagerOpen(true);
  };

  // Ouvrir l'historique des statuts
  const handleOpenStatusHistory = async (devisItem: any) => {
    setSelectedDevisId(devisItem.id);
    setSelectedDevisNumero(devisItem.numero);
    await loadStatusHistory(devisItem.id);
    setStatusHistoryOpen(true);
  };

  // Changer le statut d'un devis - CORRIGÉ
  const handleStatusChange = async (newStatus: any, note?: string) => {
    // Cette fonction est maintenant gérée directement par StatusManager
    // On rafraîchit juste la liste après changement
    refreshDevis();
    console.log(`✅ Interface rafraîchie après changement vers: ${newStatus}`);
  };

  // Supprimer un devis avec confirmation
  const handleDelete = async (devisId: string) => {
    const devisToDelete = devis.find(d => d.id === devisId);
    if (!devisToDelete) return;
    
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le devis ${devisToDelete.numero} ?`)) {
      return;
    }
    
    try {
      const success = await deleteDevis(devisId);
      if (success) {
        console.log('✅ Devis supprimé:', devisToDelete.numero);
      } else {
        alert("Erreur lors de la suppression");
      }
    } catch (error) {
      alert("Erreur lors de la suppression");
    }
  };

  // Dupliquer un devis
  const handleDuplicate = async (devisId: string) => {
    const devisToClone = devis.find(d => d.id === devisId);
    if (!devisToClone) return;
    
    if (!confirm(`Dupliquer le devis ${devisToClone.numero} ?`)) {
      return;
    }
    
    try {
      const newDevisId = await duplicateDevis(devisId);
      
      if (newDevisId) {
        console.log('✅ Devis dupliqué avec succès');
      } else {
        alert("❌ Erreur lors de la duplication du devis");
      }
    } catch (error) {
      alert("❌ Erreur lors de la duplication du devis");
    }
  };

  // Déterminer si un devis est expiré
  const isExpired = (dateValidite: Date, status: string) => {
    return new Date() > dateValidite && status === 'envoye';
  };

  // Couleurs selon le statut
  const getStatusColors = (status: string, dateValidite: Date) => {
    if (isExpired(dateValidite, status)) {
      return "border-l-orange-500 bg-orange-50/50";
    }
    
    switch (status) {
      case 'accepte': return "border-l-green-500 bg-green-50/50";
      case 'refuse': return "border-l-red-500 bg-red-50/50";
      case 'envoye': return "border-l-blue-500 bg-blue-50/50";
      default: return "border-l-gray-300 bg-white/50";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header avec statistiques */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={cn(
            "p-3 rounded-lg",
            "bg-gradient-to-br from-blue-500/20 to-purple-600/20",
            "border border-gray100 backdrop-blur-sm"
          )}>
            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Mes devis
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {stats.total} devis • {formatPrice(stats.chiffreAffaireMensuel)} ce mois
            </p>
          </div>
        </div>

        <button
          onClick={() => router.push("/devis/new")}
          className={cn(
            "flex items-center space-x-2 px-6 py-3 rounded-lg",
            "bg-blue-600 hover:bg-blue-700 text-white",
            "transition-all duration-200 font-medium",
            "shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30",
            "hover:-translate-y-0.5"
          )}
        >
          <Plus className="w-5 h-5" />
          <span>Nouveau devis</span>
        </button>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200">
          <p className="text-red-700">{error}</p>
          <button 
            onClick={refreshDevis}
            className="mt-2 text-sm text-red-600 hover:underline"
          >
            Réessayer
          </button>
        </div>
      )}

      {/* Statistiques rapides avec nouveaux statuts */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className={cn(
          "p-4 rounded-lg border border-gray-200",
          "bg-white/5 backdrop-blur-md text-center"
        )}>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {stats.brouillons}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Brouillons</div>
        </div>
        
        <div className={cn(
          "p-4 rounded-lg border border-gray-200",
          "bg-white/5 backdrop-blur-md text-center"
        )}>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {stats.envoyes}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Envoyés</div>
        </div>
        
        <div className={cn(
          "p-4 rounded-lg border border-gray-200",
          "bg-white/5 backdrop-blur-md text-center"
        )}>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {stats.acceptes}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Acceptés</div>
        </div>
        
        <div className={cn(
          "p-4 rounded-lg border border-gray-200",
          "bg-white/5 backdrop-blur-md text-center"
        )}>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {stats.refuses}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Refusés</div>
        </div>

        <div className={cn(
          "p-4 rounded-lg border border-gray-200",
          "bg-white/5 backdrop-blur-md text-center"
        )}>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {stats.margeGlobaleMoyenne.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Marge moy.</div>
        </div>
      </div>

      {/* Filtres et recherche étendus */}
      <div className={cn(
        "p-4 rounded-xl border border-gray-200",
        "bg-white/5 backdrop-blur-md"
      )}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-500" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par numéro, client..."
              className={cn(
                "w-full pl-10 pr-4 py-3 rounded-lg",
                "bg-gray-100 backdrop-blur-sm border border-gray-200",
                "text-gray-900 dark:text-gray-100 placeholder-gray-500",
                "focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              )}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="w-5 h-5 text-gray-500" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={cn(
                "pl-10 pr-8 py-3 rounded-lg appearance-none",
                "bg-gray-100 backdrop-blur-sm border border-gray-200",
                "text-gray-900 dark:text-gray-100",
                "focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              )}
            >
              <option value="">Tous les statuts</option>
              <option value="brouillon">Brouillons</option>
              <option value="envoye">Envoyés</option>
              <option value="accepte">Acceptés</option>
              <option value="refuse">Refusés</option>
              <option value="expire">Expirés</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des devis avec gestion statuts */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={cn(
              "h-48 rounded-xl animate-pulse",
              "bg-white/5 border border-gray100"
            )} />
          ))}
        </div>
      ) : devis.length === 0 ? (
        <div className={cn(
          "p-12 rounded-xl text-center",
          "bg-white/5 border border-gray100"
        )}>
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {searchQuery || statusFilter ? "Aucun devis trouvé" : "Aucun devis créé"}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchQuery || statusFilter 
              ? "Essayez de modifier vos critères de recherche"
              : "Créez votre premier devis pour commencer"
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devis.map((devisItem) => {
            const expired = isExpired(devisItem.dateValidite, devisItem.status);
            
            return (
              <div
                key={devisItem.id}
                className={cn(
                  "p-6 rounded-xl border-l-4 transition-all duration-200",
                  "bg-white/5 backdrop-blur-md hover:shadow-xl hover:-translate-y-1",
                  getStatusColors(devisItem.status, devisItem.dateValidite)
                )}
              >
                {/* Header avec statut */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {devisItem.numero}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {devisItem.clientNom}
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <StatusBadge 
                      status={expired ? 'expire' : devisItem.status as any} 
                      size="sm" 
                    />
                    {expired && (
                      <div className="flex items-center space-x-1 text-xs text-orange-600">
                        <Clock className="w-3 h-3" />
                        <span>Expiré</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Montants */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total TTC</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {formatPrice(devisItem.totalTTC)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Marge</span>
                    <span className="text-sm font-medium">
                      {devisItem.margeGlobale.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Dates */}
                <div className="text-xs text-gray-500 mb-4">
                  <div>Créé le {devisItem.createdAt.toLocaleDateString('fr-FR')}</div>
                  <div>Valide jusqu'au {devisItem.dateValidite.toLocaleDateString('fr-FR')}</div>
                </div>

                {/* Actions étendues */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-1">
                    <button
                      onClick={() => router.push(`/devis/new?id=${devisItem.id}`)}
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        "hover:bg-blue-500/20 text-blue-600 dark:text-blue-400"
                      )}
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => handleDuplicate(devisItem.id)}
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        "hover:bg-green-500/20 text-green-600 dark:text-green-400"
                      )}
                      title="Dupliquer"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    {/* Nouveau : Gestion statut */}
                    <button
                      onClick={() => handleOpenStatusManager(devisItem)}
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        "hover:bg-purple-500/20 text-purple-600 dark:text-purple-400"
                      )}
                      title="Changer le statut"
                    >
                      <Settings className="w-4 h-4" />
                    </button>

                    {/* Nouveau : Historique statut */}
                    <button
                      onClick={() => handleOpenStatusHistory(devisItem)}
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        "hover:bg-orange-500/20 text-orange-600 dark:text-orange-400"
                      )}
                      title="Voir l'historique"
                    >
                      <History className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => handleDelete(devisItem.id)}
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        "hover:bg-red-500/20 text-red-600 dark:text-red-400"
                      )}
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal gestionnaire de statuts CORRIGÉ */}
      <StatusManager
        isOpen={statusManagerOpen}
        onClose={() => setStatusManagerOpen(false)}
        currentStatus={selectedDevisStatus as any}
        devisNumero={selectedDevisNumero}
        devisId={selectedDevisId || ''} // ✅ CORRECTION: Passer l'ID du devis
        onStatusChange={handleStatusChange}
        loading={statusLoading}
      />

      {/* Modal historique des statuts */}
      {statusHistoryOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div 
              className="fixed inset-0 backdrop-blur-sm bg-black/40"
              onClick={() => setStatusHistoryOpen(false)}
            />
            
            <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold">
                  Historique - Devis {selectedDevisNumero}
                </h2>
                <button
                  onClick={() => setStatusHistoryOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6">
                <StatusHistory
                  changes={statusHistory.map(h => ({
                    id: h.id,
                    previousStatus: h.previous_status,
                    newStatus: h.new_status,
                    changedAt: new Date(h.changed_at),
                    changedBy: h.changed_by,
                    note: h.note
                  }))}
                  currentStatus={selectedDevisStatus}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}