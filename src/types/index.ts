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
  prixUnitaire: number; // Prix de vente HT
  prixAchat?: number; // Pour calcul marge
  remise: number;
  tva: number;
  colissage?: number; // Pour calcul nb colis
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