"use client";

import { cn } from "@/lib/utils/cn";
import { Client } from "@/types";
import { Save, FileX, FileText, ArrowLeft } from "lucide-react";
import { formatPrice } from "@/lib/utils/devisUtils";

interface DevisHeaderProps {
  client: Client | null;
  numeroDevis: string;
  dateCreation: Date;
  dateValidite: Date;
  totalTTC: number;
  onSave: () => void;
  onCancel: () => void;
  onExportPDF: () => void;
  saving?: boolean;
}

/**
 * Header du devis avec infos client et actions
 * Navigation + métadonnées + toolbar actions
 */
export function DevisHeader({
  client,
  numeroDevis,
  dateCreation,
  dateValidite,
  totalTTC,
  onSave,
  onCancel,
  onExportPDF,
  saving
}: DevisHeaderProps) {
  
  return (
    <div className="space-y-4">
      {/* Breadcrumb navigation */}
      <div className="flex items-center space-x-2 text-sm">
        <button 
          onClick={onCancel}
          className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour au tableau de bord</span>
        </button>
        <span className="text-gray-500">/</span>
        <span className="text-gray-700 dark:text-gray-300">Nouveau devis</span>
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
                  Création d'un nouveau devis
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

            {/* Informations client */}
            {client ? (
              <div className={cn(
                "p-4 rounded-lg border border-gray100",
                "bg-white/5 backdrop-blur-sm"
              )}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {client.nom}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {client.adresse}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>📞 {client.telephone}</span>
                      <span>✉️ {client.email}</span>
                      <span>🏢 {client.siret}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {formatPrice(totalTTC)}
                    </div>
                    <div className="text-sm text-gray-500">Total TTC</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className={cn(
                "p-4 rounded-lg border-2 border-dashed border-orange-300",
                "bg-orange-50/50 dark:bg-orange-900/20"
              )}>
                <p className="text-orange-700 dark:text-orange-300 font-medium">
                  ⚠️ Aucun client sélectionné
                </p>
                <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                  Veuillez sélectionner un client pour continuer
                </p>
              </div>
            )}
          </div>

          {/* Actions toolbar */}
          <div className="flex items-center space-x-3 ml-6">
            <button
              onClick={onExportPDF}
              disabled={!client || totalTTC === 0}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-lg",
                "bg-gray-200 hover:bg-gray-300 border border-white/30",
                "backdrop-blur-sm text-gray-700 dark:text-gray-300",
                "transition-all duration-200 text-sm font-medium",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "hover:-translate-y-0.5"
              )}
            >
              <FileText className="w-4 h-4" />
              <span>Export PDF</span>
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