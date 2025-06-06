"use client";

import { cn } from "@/lib/utils/cn";
import { Client, DevisLine, DevisCalculations } from "@/types";
import { Save, FileX, FileText, ArrowLeft } from "lucide-react";
import { formatPrice } from "@/lib/utils/devisUtils";
import { ClientSelector } from "../ClientSelector";
import { PdfGenerator } from "@/lib/pdf/pdfGenerator";

interface DevisHeaderProps {
  client: Client | null;
  numeroDevis: string;
  dateCreation: Date;
  dateValidite: Date;
  totalTTC: number;
  // NOUVELLES PROPS pour tri
  sortedLignes: DevisLine[];
  calculations: DevisCalculations;
  onSave: () => void;
  onCancel: () => void;
  onExportPDF: () => void;
  onSelectClient: (client: Client) => void;
  onCreateClient?: () => void;
  saving?: boolean;
  isDirty?: boolean;
  lastSaved?: Date | null;
}

/**
 * Header AVEC export PDF trié
 * Utilise les lignes triées pour générer le PDF
 */
export function DevisHeader({
  client,
  numeroDevis,
  dateCreation,
  dateValidite,
  totalTTC,
  // NOUVELLES PROPS
  sortedLignes,
  calculations,
  onSave,
  onCancel,
  onExportPDF,
  onSelectClient,
  onCreateClient,
  saving,
  isDirty,
  lastSaved
}: DevisHeaderProps) {
  
  // NOUVELLE FONCTION - Export PDF avec tri CORRIGÉE
  const handleExportPDFSorted = async () => {
    if (!client) {
      alert("Veuillez sélectionner un client avant d'exporter");
      return;
    }

    // ✅ PROTECTION contre undefined
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
        lignes: sortedLignes, // ✅ UTILISER LES LIGNES TRIÉES
        calculations
      });
      
      console.log('✅ PDF généré avec ordre de tri respecté');
      
    } catch (error) {
      console.error("❌ Erreur export PDF:", error);
      alert("Erreur lors de l'export PDF. Veuillez réessayer.");
    }
  };
  
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

        {/* Indicateur de sauvegarde */}
        {isDirty !== undefined && (
          <div className="flex items-center space-x-2 text-sm">
            {isDirty ? (
              <span className="text-orange-600 dark:text-orange-400">
                ● Modifications non sauvegardées
              </span>
            ) : lastSaved ? (
              <span className="text-green-600 dark:text-green-400">
                ✓ Sauvegardé à {lastSaved.toLocaleTimeString('fr-FR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            ) : null}
          </div>
        )}
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
                <p className="text-gray-600 dark:text-gray-400">
                  {client ? "Modification d'un devis existant" : "Création d'un nouveau devis"}
                </p>
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
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {dateValidite.toLocaleDateString('fr-FR')}
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
            {/* BOUTON PDF MODIFIÉ - Utilise les lignes triées + PROTECTION */}
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
              <span>Export PDF trié</span>
            </button>

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
    </div>
  );
}