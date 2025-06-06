"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { Client, DevisLine, DevisCalculations, DevisStatus } from "@/types";
import { Save, FileX, FileText, ArrowLeft, Settings, History } from "lucide-react";
import { formatPrice } from "@/lib/utils/devisUtils";
import { ClientSelector } from "../ClientSelector";
import { PdfGenerator } from "@/lib/pdf/pdfGenerator";

import { supabase } from "@/lib/database/supabase"; // ✅ AJOUT pour historique
import { StatusBadge } from "../status/StatusBadge";
import { StatusHistory } from "../status/StatusHistory";
import { StatusManager } from "../status/StatusManager";

interface DevisHeaderProps {
  client: Client | null;
  numeroDevis: string;
  dateCreation: Date;
  dateValidite: Date;
  totalTTC: number;
  currentStatus?: DevisStatus;
  devisId?: string;
  sortedLignes: DevisLine[];
  calculations: DevisCalculations;
  onSave: () => void;
  onCancel: () => void;
  onExportPDF: () => void;
  onSelectClient: (client: Client) => void;
  onCreateClient?: () => void;
  onStatusChanged?: (newStatus: DevisStatus) => void;
  saving?: boolean;
  isDirty?: boolean;
  lastSaved?: Date | null;
}

/**
 * Header AVEC GESTION COMPLÈTE DES STATUTS
 * Intégration StatusBadge + StatusManager + StatusHistory
 */
export function DevisHeader({
  client,
  numeroDevis,
  dateCreation,
  dateValidite,
  totalTTC,
  currentStatus = 'brouillon',
  devisId,
  sortedLignes,
  calculations,
  onSave,
  onCancel,
  onExportPDF,
  onSelectClient,
  onCreateClient,
  onStatusChanged,
  saving,
  isDirty,
  lastSaved
}: DevisHeaderProps) {
  
  // États pour les modals
  const [showStatusManager, setShowStatusManager] = useState(false);
  const [showStatusHistory, setShowStatusHistory] = useState(false);
  const [statusHistory, setStatusHistory] = useState<any[]>([]); // ✅ AJOUT état local
  const [statusLoading, setStatusLoading] = useState(false); // ✅ AJOUT état loading

  // ✅ NOUVELLE FONCTION - Charger l'historique directement
  const loadStatusHistory = async (devisIdToLoad: string) => {
    try {
      setStatusLoading(true);
      
      const { data, error } = await supabase
        .from('devis_status_history')
        .select('*')
        .eq('devis_id', devisIdToLoad)
        .order('changed_at', { ascending: false });

      if (error) {
        console.error('Erreur chargement historique:', error);
        return;
      }

      setStatusHistory(data || []);
      console.log(`✅ ${data?.length || 0} changements d'historique chargés`);

    } catch (err) {
      console.error('❌ Erreur historique:', err);
    } finally {
      setStatusLoading(false);
    }
  };

  // ✅ FONCTION SIMPLIFIÉE - Vérification expiration
  const checkExpiredStatus = (dateValidite: Date): DevisStatus => {
    const now = new Date();
    const isExpired = now > dateValidite;
    
    if (isExpired && currentStatus === 'envoye') {
      return 'expire';
    }
    
    return currentStatus;
  };

  // Vérifier si le devis est expiré
  const effectiveStatus = checkExpiredStatus(dateValidite);
  
  // Export PDF avec tri CORRIGÉ + PROTECTION
  const handleExportPDFSorted = async () => {
    if (!client) {
      alert("Veuillez sélectionner un client avant d'exporter");
      return;
    }

    if (!sortedLignes || sortedLignes.length === 0) {
      alert("Ajoutez au moins un produit avant d'exporter");
      return;
    }

    try {
      console.log(`📄 Export PDF avec ${sortedLignes.length} lignes triées`);
      
      await PdfGenerator.generateAndDownload({
        numeroDevis,
        dateCreation,
        dateValidite,
        client,
        lignes: sortedLignes,
        calculations
      });
      
      console.log('✅ PDF généré avec ordre de tri respecté');
      
    } catch (error) {
      console.error("❌ Erreur export PDF:", error);
      alert("Erreur lors de l'export PDF. Veuillez réessayer.");
    }
  };

  // Ouvrir le gestionnaire de statuts
  const handleOpenStatusManager = () => {
    setShowStatusManager(true);
  };

  // Ouvrir l'historique des statuts
  const handleOpenStatusHistory = async () => {
    if (devisId) {
      await loadStatusHistory(devisId);
    }
    setShowStatusHistory(true);
  };

  // Changer le statut du devis - ✅ SIMPLIFIÉ
  const handleStatusChange = async (newStatus: DevisStatus, note?: string) => {
    try {
      // StatusManager gère maintenant directement le changement
      // On notifie juste le parent du changement
      onStatusChanged?.(newStatus);
      console.log(`✅ Statut changé vers: ${newStatus}`);
    } catch (error) {
      console.error('❌ Erreur changement statut:', error);
      throw error;
    }
  };

  // Déterminer si le devis permet les modifications
  const allowsModification = effectiveStatus === 'brouillon';

  return (
    <div className="space-y-4">
      {/* Breadcrumb navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm">
          <button 
            onClick={onCancel}
            className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour</span>
          </button>
          <span className="text-gray-500">/</span>
          <span className="text-gray-700 dark:text-gray-300">
            {client ? "Modifier devis" : "Nouveau devis"}
          </span>
        </div>

        {/* Statut et indicateurs */}
        <div className="flex items-center space-x-4">
          {/* Statut actuel */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Statut:</span>
            <StatusBadge status={effectiveStatus} size="md" />
          </div>

          {/* Indicateur modifications */}
          {isDirty !== undefined && (
            <div className="text-sm">
              {isDirty ? (
                <span className="text-orange-600 dark:text-orange-400">
                  ● Non sauvegardé
                </span>
              ) : lastSaved ? (
                <span className="text-green-600 dark:text-green-400">
                  ✓ Sauvé à {lastSaved.toLocaleTimeString('fr-FR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {/* Header principal */}
      <div className={cn(
        "p-6 rounded-xl border border-gray-200",
        "bg-white/5 backdrop-blur-md",
        "supports-[backdrop-filter]:bg-white/5"
      )}>
        <div className="flex items-start justify-between">
          {/* Informations devis */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center space-x-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Devis #{numeroDevis}
                </h1>
                <div className="flex items-center space-x-3 mt-1">
                  <p className="text-gray-600 dark:text-gray-400">
                    {client ? "Modification d'un devis existant" : "Création d'un nouveau devis"}
                  </p>
                  {!allowsModification && (
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                      ⚠️ Modifications limitées
                    </span>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <span className="text-gray-500 block">Date de création</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {dateCreation.toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">Valide jusqu'au</span>
                  <span className={cn(
                    "font-medium",
                    effectiveStatus === 'expire' 
                      ? "text-orange-600 dark:text-orange-400" 
                      : "text-gray-900 dark:text-gray-100"
                  )}>
                    {dateValidite.toLocaleDateString('fr-FR')}
                    {effectiveStatus === 'expire' && (
                      <span className="ml-2 text-xs">⚠️ Expiré</span>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Sélection du client */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Client *
                </label>
                <ClientSelector
                  selectedClient={client}
                  onSelectClient={onSelectClient}
                  onCreateClient={onCreateClient}
                />
              </div>
              
              {/* Total TTC */}
              <div className="flex items-end">
                <div className="w-full text-center lg:text-right">
                  <div className="text-sm text-gray-500 mb-1">Total TTC</div>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {formatPrice(totalTTC)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions toolbar */}
          <div className="flex items-center space-x-3 ml-6">
            {/* NOUVEAU : Gestion statuts - ✅ PROTECTION */}
            {devisId && (
              <>
                <button
                  onClick={handleOpenStatusManager}
                  disabled={statusLoading}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-lg",
                    "bg-purple-600/20 hover:bg-purple-600/30 border border-purple-600/30",
                    "backdrop-blur-sm text-purple-700 dark:text-purple-300",
                    "transition-all duration-200 text-sm font-medium",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "hover:-translate-y-0.5"
                  )}
                  title="Changer le statut du devis"
                >
                  <Settings className="w-4 h-4" />
                  <span>Statut</span>
                </button>

                <button
                  onClick={handleOpenStatusHistory}
                  disabled={statusLoading}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-lg",
                    "bg-orange-600/20 hover:bg-orange-600/30 border border-orange-600/30",
                    "backdrop-blur-sm text-orange-700 dark:text-orange-300",
                    "transition-all duration-200 text-sm font-medium",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "hover:-translate-y-0.5"
                  )}
                  title="Voir l'historique des statuts"
                >
                  <History className="w-4 h-4" />
                  <span>Historique</span>
                </button>
              </>
            )}

            {/* Export PDF */}
            <button
              onClick={handleExportPDFSorted}
              disabled={!client || !sortedLignes || sortedLignes.length === 0}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-lg",
                "bg-gray-200 hover:bg-gray-300 border border-white/30",
                "backdrop-blur-sm text-gray-700 dark:text-gray-300",
                "transition-all duration-200 text-sm font-medium",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "hover:-translate-y-0.5"
              )}
              title="Export PDF avec ordre de tri actuel"
            >
              <FileText className="w-4 h-4" />
              <span>Export PDF</span>
            </button>

            {/* Sauvegarde */}
            <button
              onClick={onSave}
              disabled={!client || saving}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-lg",
                "bg-green-600 hover:bg-green-700 text-white",
                "transition-all duration-200 text-sm font-medium",
                "shadow-lg shadow-green-600/25 hover:shadow-xl hover:shadow-green-600/30",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "hover:-translate-y-0.5"
              )}
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Sauvegarde..." : "Sauvegarder"}</span>
            </button>

            {/* Annulation */}
            <button
              onClick={onCancel}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-lg",
                "bg-red-500/20 hover:bg-red-500/30 border border-red-500/30",
                "backdrop-blur-sm text-red-700 dark:text-red-300",
                "transition-all duration-200 text-sm font-medium",
                "hover:-translate-y-0.5"
              )}
            >
              <FileX className="w-4 h-4" />
              <span>Annuler</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal gestionnaire de statuts - ✅ CORRIGÉ */}
      {devisId && (
        <StatusManager
          isOpen={showStatusManager}
          onClose={() => setShowStatusManager(false)}
          currentStatus={effectiveStatus}
          devisNumero={numeroDevis}
          devisId={devisId} // ✅ CORRECTION: Passer l'ID du devis
          onStatusChange={handleStatusChange}
          loading={statusLoading}
        />
      )}

      {/* Modal historique des statuts */}
      {showStatusHistory && (
        <div className="fixed inset-0 z-[999999] overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div 
              className="fixed inset-0 backdrop-blur-sm bg-black/40"
              onClick={() => setShowStatusHistory(false)}
            />
            
            <div className="relative w-full max-w-3xl bg-white backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">
                  Historique des statuts - Devis {numeroDevis}
                </h2>
                <button
                  onClick={() => setShowStatusHistory(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                >
                  <FileX className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 max-h-96 overflow-y-auto">
                <StatusHistory
                  changes={statusHistory.map(h => ({
                    id: h.id,
                    previousStatus: h.previous_status,
                    newStatus: h.new_status,
                    changedAt: new Date(h.changed_at),
                    changedBy: h.changed_by,
                    note: h.note
                  }))}
                  currentStatus={effectiveStatus}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}