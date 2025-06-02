/**
 * Types principaux de l'application MIS À JOUR
 * Intégration de la nouvelle structure Product simplifiée
 */

export interface Client {
  id: string;
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
  siret: string;
  createdAt: Date;
}

// NOUVEAU : Import des types Product simplifiés
export type { Product, ProductCreateInput, ProductUpdateInput, ProductSortBy, ProductFilters } from "./product";
export { ProductUtils } from "./product";

export interface DevisLine {
  id: string;
  productCode: string;
  designation: string;
  quantite: number;
  prixUnitaire: number; // Prix de vente base
  prixAchat?: number; // Pour calcul marge
  remise: number; // Pourcentage
  tva: number;
  colissage?: number; // Pour calcul nb colis
  
  // Calculs automatiques
  prixApresRemise?: number;  // Prix après remise
  totalHT?: number;          // Qté × PrixApresRemise
  totalTVA?: number;         // TotalHT × TVA/100
  totalTTC?: number;         // TotalHT + TotalTVA
  margeEuros?: number;       // (PrixApresRemise - PrixAchat) × Qté
  margePourcent?: number;    // MargeEuros / (PrixAchat × Qté) × 100
}

// Interface Devis complète
export interface Devis {
  id: string;
  numero: string;
  date: Date;
  dateValidite: Date;
  clientId: string;
  clientNom?: string; // Pour affichage rapide sans lookup
  lignes: DevisLine[];
  status: 'brouillon' | 'envoye' | 'accepte' | 'refuse' | 'expire';
  totalHT: number;
  totalTTC: number;
  margeGlobale: number; // Pourcentage
  notes?: string; // Notes internes
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardStats {
  totalDevis: number;
  chiffreAffaires: number;
  margeGlobale: number;
  clientsActifs: number;
}

// Calculs globaux temps réel
export interface DevisCalculations {
  totalHT: number;
  totalTVA: number;
  totalTTC: number;
  margeGlobaleEuros: number;
  margeGlobalePourcent: number;
  nombreLignes: number;
  quantiteTotale: number;
}

// États de formulaire devis
export interface DevisFormState {
  isEditing: boolean;
  isDirty: boolean; // Modifications non sauvegardées
  lastSaved?: Date;
  autoSaveEnabled: boolean;
}

// Options d'export
export interface DevisExportOptions {
  includeMarges: boolean;
  includeDetails: boolean;
  format: 'pdf' | 'excel' | 'csv';
  template: 'standard' | 'minimal' | 'detaille';
}