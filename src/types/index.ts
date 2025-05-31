/**
 * Types principaux de l'application
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

export interface Product {
  code: string;
  designation: string;
  prixAchat: number;
  prixVente: number;
  unite: string;
  categorie: string;
  colissage: number;
  tva: number;
}

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
  
  // Calculs automatiques (ajoutés)
  prixApresRemise?: number;  // Prix après remise
  totalHT?: number;          // Qté × PrixApresRemise
  totalTVA?: number;         // TotalHT × TVA/100
  totalTTC?: number;         // TotalHT + TotalTVA
  margeEuros?: number;       // (PrixApresRemise - PrixAchat) × Qté
  margePourcent?: number;    // MargeEuros / (PrixAchat × Qté) × 100
}

export interface Devis {
  id: string;
  numero: string;
  date: Date;
  dateValidite: Date;
  clientId: string;
  lignes: DevisLine[];
  status: 'brouillon' | 'envoye' | 'accepte' | 'refuse';
  totalHT: number;
  totalTTC: number;
  margeGlobale: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardStats {
  totalDevis: number;
  chiffreAffaires: number;
  margeGlobale: number;
  clientsActifs: number;
}

// Nouveau type pour calculs globaux
export interface DevisCalculations {
  totalHT: number;
  totalTVA: number;
  totalTTC: number;
  margeGlobaleEuros: number;
  margeGlobalePourcent: number;
  nombreLignes: number;
  quantiteTotale: number;
}