"use client";

import { cn } from "@/lib/utils/cn";
import { DevisHeader } from "./DevisHeader";
import { ProductCombobox } from "../../products/ProductCombobox";
import { DevisTable } from "../table/DevisTable";
import { MargeIndicators } from "../indicators/MargeIndicators";
import { FinancialSummary } from "../summary/FinancialSummary";
import { Client, DevisLine, Product, DevisCalculations } from "@/types";

interface DevisLayoutProps {
  client: Client | null;
  numeroDevis: string;
  dateCreation: Date;
  dateValidite: Date;
  lignes: DevisLine[];
  calculations: DevisCalculations;
  onSave: () => void;
  onCancel: () => void;
  onExportPDF: () => void;
  onSelectClient: (client: Client) => void;     // AJOUTÉ
  onCreateClient?: () => void;                  // AJOUTÉ
  onAddProduct: (product?: Product) => void;
  onUpdateLine: (id: string, updates: Partial<DevisLine>) => void;
  onDeleteLine: (id: string) => void;
  onDuplicateLine: (id: string) => void;
  saving?: boolean;
  isDirty?: boolean;                            // AJOUTÉ
  lastSaved?: Date | null;                      // AJOUTÉ
  isEditing?: boolean;                          // AJOUTÉ
}

/**
 * Layout principal du devis CORRIGÉ
 * Transmission correcte de toutes les props
 */
export function DevisLayout({
  client,
  numeroDevis,
  dateCreation,
  dateValidite,
  lignes,
  calculations,
  onSave,
  onCancel,
  onExportPDF,
  onSelectClient,        // NOUVELLE PROP
  onCreateClient,        // NOUVELLE PROP
  onAddProduct,
  onUpdateLine,
  onDeleteLine,
  onDuplicateLine,
  saving,
  isDirty,              // NOUVELLE PROP
  lastSaved,            // NOUVELLE PROP
  isEditing
}: DevisLayoutProps) {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-6 py-6 max-w-full">
        <div className="space-y-6">
          {/* Header avec infos devis et sélecteur client */}
          <DevisHeader
            client={client}
            numeroDevis={numeroDevis}
            dateCreation={dateCreation}
            dateValidite={dateValidite}
            totalTTC={calculations.totalTTC}
            onSave={onSave}
            onCancel={onCancel}
            onExportPDF={onExportPDF}
            onSelectClient={onSelectClient}    // TRANSMISSION PROP
            onCreateClient={onCreateClient}    // TRANSMISSION PROP
            saving={saving}
            isDirty={isDirty}                  // TRANSMISSION PROP
            lastSaved={lastSaved}              // TRANSMISSION PROP
          />

          {/* Indicateurs de marge horizontaux */}
          <MargeIndicators calculations={calculations} />

          {/* Barre de recherche produits */}
          <div className={cn(
            "p-4 rounded-xl border border-gray-200",
            "bg-white/5 backdrop-blur-md"
          )}>
            <div className="flex items-center space-x-4">
              <ProductCombobox
                onSelect={onAddProduct}
                placeholder="🔍 Rechercher et ajouter un produit au devis..."
                className="flex-1"
              />
            </div>
          </div>

          {/* Tableau étendu pleine largeur */}
          <DevisTable
            lignes={lignes}
            onUpdateLine={onUpdateLine}
            onDeleteLine={onDeleteLine}
            onDuplicateLine={onDuplicateLine}
            className="min-h-[400px]"
          />

          {/* Résumé financier en bas */}
          <FinancialSummary calculations={calculations} />

          {/* Footer avec mentions légales */}
          <div className={cn(
            "p-4 rounded-lg border border-white/10",
            "bg-white/5 backdrop-blur-sm text-center"
          )}>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Les prix s'entendent hors taxes. Devis valable {Math.ceil((dateValidite.getTime() - dateCreation.getTime()) / (1000 * 60 * 60 * 24))} jours.
              Toute commande implique l'acceptation de nos conditions générales de vente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}