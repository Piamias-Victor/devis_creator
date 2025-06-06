"use client";

import { cn } from "@/lib/utils/cn";
import { DevisHeader } from "./DevisHeader";
import { ProductsZone } from "./ProductsZone";
import { MargeIndicators } from "../indicators/MargeIndicators";
import { FinancialSummary } from "../summary/FinancialSummary";
import { Client, DevisLine, Product, DevisCalculations } from "@/types";
import { DevisSortField, SortDirection } from "../table/useDevisSort";

interface DevisLayoutProps {
  client: Client | null;
  numeroDevis: string;
  dateCreation: Date;
  dateValidite: Date;
  lignes: DevisLine[];
  calculations: DevisCalculations;
  // NOUVELLES PROPS pour le tri
  sortedLignes: DevisLine[];
  sortField: DevisSortField;
  sortDirection: SortDirection;
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
  onSaveLineToDatabase?: (ligne: DevisLine) => Promise<void>;
  saving?: boolean;
  isDirty?: boolean;
  lastSaved?: Date | null;
  isEditing?: boolean;
}

/**
 * Layout principal AVEC TRANSMISSION TRI
 * Passe les lignes triées au header pour export PDF
 */
export function DevisLayout({
  client,
  numeroDevis,
  dateCreation,
  dateValidite,
  lignes,
  calculations,
  // NOUVELLES PROPS tri
  sortedLignes,
  sortField,
  sortDirection,
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
  onSaveLineToDatabase,
  saving,
  isDirty,
  lastSaved,
  isEditing
}: DevisLayoutProps) {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="w-full px-4 py-6">
        <div className="space-y-6 max-w-none">
          {/* Header AVEC lignes triées pour PDF + PROTECTION */}
          <DevisHeader
            client={client}
            numeroDevis={numeroDevis}
            dateCreation={dateCreation}
            dateValidite={dateValidite}
            totalTTC={calculations.totalTTC}
            // ✅ PROTECTION - Valeurs par défaut si undefined
            sortedLignes={sortedLignes || lignes || []}
            calculations={calculations}
            onSave={onSave}
            onCancel={onCancel}
            onExportPDF={onExportPDF}
            onSelectClient={onSelectClient}
            onCreateClient={onCreateClient}
            saving={saving}
            isDirty={isDirty}
            lastSaved={lastSaved}
          />

          {/* Indicateur tri actuel */}
          {lignes.length > 0 && (
            <div className={cn(
              "p-3 rounded-lg border border-blue-200",
              "bg-blue-50/50 backdrop-blur-sm text-center"
            )}>
              <span className="text-sm text-blue-700">
                📊 Ordre actuel: <strong>{sortField === 'designation' ? 'Alphabétique' : 
                                      sortField === 'quantite' ? 'Quantité' :
                                      sortField === 'prixUnitaire' ? 'Prix unitaire' :
                                      sortField === 'margePourcent' ? 'Marge %' :
                                      sortField === 'totalTTC' ? 'Total TTC' : 'Défaut'}</strong> 
                ({sortDirection === 'asc' ? 'Croissant ↑' : 'Décroissant ↓'}) 
                • Le PDF respectera cet ordre
              </span>
            </div>
          )}

          {/* Indicateurs de marge */}
          <MargeIndicators calculations={calculations} />

          {/* Zone produits avec tri intégré */}
          <ProductsZone
            lignes={lignes}
            onAddProduct={onAddProduct}
            onUpdateLine={onUpdateLine}
            onDeleteLine={onDeleteLine}
            onDuplicateLine={onDuplicateLine}
            onRefreshProducts={onRefreshProducts}
            onSaveLineToDatabase={onSaveLineToDatabase}
            totals={{
              totalHT: calculations.totalHT,
              totalTVA: calculations.totalTVA,
              totalTTC: calculations.totalTTC
            }}
            className="min-h-[400px] w-full"
          />

          {/* Résumé financier */}
          <FinancialSummary calculations={calculations} />

          {/* Footer */}
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