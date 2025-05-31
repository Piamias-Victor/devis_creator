"use client";

import { cn } from "@/lib/utils/cn";
import { DevisHeader } from "./DevisHeader";
import { ProductsZone } from "./ProductsZone";
import { DevisSidebar } from "./DevisSidebar";
import { Client, DevisLine, Product } from "@/types";

interface DevisLayoutProps {
  client: Client | null;
  numeroDevis: string;
  dateCreation: Date;
  dateValidite: Date;
  lignes: DevisLine[];
  onSave: () => void;
  onCancel: () => void;
  onExportPDF: () => void;
  onAddProduct: (product?: Product) => void;
  onUpdateLine: (id: string, updates: Partial<DevisLine>) => void;
  onDuplicateLine: (id: string) => void;
  totals: {
    totalHT: number;
    totalTVA: number;
    totalTTC: number;
  };
  saving?: boolean;
}

/**
 * Layout principal de création de devis
 * Organisation desktop large écran optimisée
 */
export function DevisLayout({
  client,
  numeroDevis,
  dateCreation,
  dateValidite,
  lignes,
  remiseGlobale,
  onChangeRemiseGlobale,
  onSave,
  onCancel,
  onExportPDF,
  onAddProduct,
  onUpdateLine,
  onDeleteLine,
  onDuplicateLine,
  totals,
  saving
}: DevisLayoutProps) {
  
  // Calcul total TTC pour le header depuis totals
  const totalTTC = totals.totalTTC;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-6 py-6 max-w-7xl">
        <div className="space-y-6">
          {/* Header avec infos devis et actions */}
          <DevisHeader
            client={client}
            numeroDevis={numeroDevis}
            dateCreation={dateCreation}
            dateValidite={dateValidite}
            totalTTC={totalTTC}
            onSave={onSave}
            onCancel={onCancel}
            onExportPDF={onExportPDF}
            saving={saving}
          />

          {/* Layout principal: Zone produits + Sidebar */}
          <div className="flex gap-6 min-h-[600px]">
            {/* Zone centrale des produits */}
            <ProductsZone
              lignes={lignes}
              onAddProduct={onAddProduct}
              onUpdateLine={onUpdateLine}
              onDeleteLine={onDeleteLine}
              onDuplicateLine={onDuplicateLine}
              totals={totals}
              className="flex-1"
            />

            {/* Sidebar fixe des calculs */}
            <DevisSidebar
              lignes={lignes}
              remiseGlobale={remiseGlobale}
              onChangeRemiseGlobale={onChangeRemiseGlobale}
              totals={totals}
              className="flex-shrink-0"
            />
          </div>

          {/* Footer avec mentions légales */}
          <div className={cn(
            "p-4 rounded-lg border border-white/10",
            "bg-white/5 backdrop-blur-sm text-center",
            "supports-[backdrop-filter]:bg-white/5"
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