"use client";

import { cn } from "@/lib/utils/cn";
import { DevisHeader } from "./DevisHeader";
import { ProductsZone } from "./ProductsZone"; // MODIFIÉE POUR INCLURE REFRESH
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
  onSelectClient: (client: Client) => void;
  onCreateClient?: () => void;
  onAddProduct: any;
  onUpdateLine: (id: string, updates: Partial<DevisLine>) => void;
  onDeleteLine: (id: string) => void;
  onDuplicateLine: (id: string) => void;
  onRefreshProducts: () => Promise<void>;
  onSaveLineToDatabase?: (ligne: DevisLine) => Promise<void>; // NOUVELLE PROP
  saving?: boolean;
  isDirty?: boolean;
  lastSaved?: Date | null;
  isEditing?: boolean;
}

/**
 * Layout principal du devis AVEC SUPPORT ACTUALISATION
 * Transmission de la fonction d'actualisation aux composants enfants
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
  onSelectClient,
  onCreateClient,
  onAddProduct,
  onUpdateLine,
  onDeleteLine,
  onDuplicateLine,
  onRefreshProducts,
  onSaveLineToDatabase, // NOUVELLE PROP
  saving,
  isDirty,
  lastSaved,
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
            onSelectClient={onSelectClient}
            onCreateClient={onCreateClient}
            saving={saving}
            isDirty={isDirty}
            lastSaved={lastSaved}
          />

          {/* Indicateurs de marge horizontaux */}
          <MargeIndicators calculations={calculations} />

          {/* Zone produits avec recherche + actualisation */}
          <ProductsZone
            lignes={lignes}
            onAddProduct={onAddProduct}
            onUpdateLine={onUpdateLine}
            onDeleteLine={onDeleteLine}
            onDuplicateLine={onDuplicateLine}
            onRefreshProducts={onRefreshProducts}
            onSaveLineToDatabase={onSaveLineToDatabase} // TRANSMISSION NOUVELLE PROP
            totals={{
              totalHT: calculations.totalHT,
              totalTVA: calculations.totalTVA,
              totalTTC: calculations.totalTTC
            }}
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