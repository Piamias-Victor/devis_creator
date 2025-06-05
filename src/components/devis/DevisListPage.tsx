"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/devisUtils";
import { useDevisList } from "@/lib/hooks/useDevisList";
import { 
  FileText, 
  Plus, 
  Search, 
  Edit, 
  Copy, 
  Trash2, 
  Filter
} from "lucide-react";

/**
 * Page de liste des devis AVEC SUPABASE
 * CRUD complet depuis base de données
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

const handleDuplicate = async (devisId: string) => {
  const devisToClone = devis.find(d => d.id === devisId);
  if (!devisToClone) return;
  
  if (!confirm(`Dupliquer le devis ${devisToClone.numero} ?\n\nUn nouveau devis sera créé avec les mêmes produits.`)) {
    return;
  }
  
  try {
    const newDevisId = await duplicateDevis(devisId);
    
    if (newDevisId) {
         // Proposer d'ouvrir le nouveau devis
      
    } else {
      alert("❌ Erreur lors de la duplication du devis");
    }
  } catch (error) {
    alert("❌ Erreur lors de la duplication du devis");
    console.error('Erreur duplication:', error);
  }
};

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'brouillon': return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
      case 'envoye': return 'bg-blue-500/20 text-blue-700 border-blue-500/30';
      case 'accepte': return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'refuse': return 'bg-red-500/20 text-red-700 border-red-500/30';
      case 'expire': return 'bg-orange-500/20 text-orange-700 border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'brouillon': return 'Brouillon';
      case 'envoye': return 'Envoyé';
      case 'accepte': return 'Accepté';
      case 'refuse': return 'Refusé';
      case 'expire': return 'Expiré';
      default: return status;
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
              Mes devis (Supabase)
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

      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {stats.margeGlobaleMoyenne.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Marge moy.</div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className={cn(
        "p-4 rounded-xl border border-gray-200",
        "bg-white/5 backdrop-blur-md"
      )}>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Recherche */}
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

          {/* Filtre statut */}
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

      {/* Liste des devis */}
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
          {!searchQuery && !statusFilter && (
            <button
              onClick={() => router.push("/devis/new")}
              className={cn(
                "px-6 py-3 rounded-lg",
                "bg-blue-600 hover:bg-blue-700 text-white",
                "transition-all duration-200 font-medium"
              )}
            >
              Créer un devis
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devis.map((devis) => (
            <div
              key={devis.id}
              className={cn(
                "p-6 rounded-xl border border-gray-200 transition-all duration-200",
                "bg-white/5 backdrop-blur-md hover:shadow-xl hover:-translate-y-1"
              )}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {devis.numero}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {devis.clientNom}
                  </p>
                </div>
                
                <span className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium border",
                  getStatusColor(devis.status)
                )}>
                  {getStatusLabel(devis.status)}
                </span>
              </div>

              {/* Montants */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total TTC</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {formatPrice(devis.totalTTC)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Marge</span>
                  <span className="text-sm font-medium">
                    {devis.margeGlobale.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Dates */}
              <div className="text-xs text-gray-500 mb-4">
                <div>Créé le {devis.createdAt.toLocaleDateString('fr-FR')}</div>
                <div>Valide jusqu'au {devis.dateValidite.toLocaleDateString('fr-FR')}</div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex space-x-1">
                  <button
                    onClick={() => router.push(`/devis/new?id=${devis.id}`)}
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      "hover:bg-blue-500/20 text-blue-600 dark:text-blue-400"
                    )}
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDuplicate(devis.id)}
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      "hover:bg-green-500/20 text-green-600 dark:text-green-400"
                    )}
                    title="Dupliquer"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(devis.id)}
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      "hover:bg-red-500/20 text-red-600 dark:text-red-400"
                    )}
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <span className="text-xs text-gray-500">
                  Base de données
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}