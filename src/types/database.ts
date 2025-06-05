import { Database } from '@/lib/database/types';

// Types extraits de la BDD Supabase
export type ClientDB = Database['public']['Tables']['clients']['Row'];
export type ProductDB = Database['public']['Tables']['produits']['Row'];
export type CategoryDB = Database['public']['Tables']['categories']['Row'];
export type DevisDB = Database['public']['Tables']['devis']['Row'];
export type LigneDevisDB = Database['public']['Tables']['lignes_devis']['Row'];

// Types pour les inserts (sans id, created_at, etc.)
export type ClientInsert = Database['public']['Tables']['clients']['Insert'];
export type ProductInsert = Database['public']['Tables']['produits']['Insert'];
export type DevisInsert = Database['public']['Tables']['devis']['Insert'];
export type LigneDevisInsert = Database['public']['Tables']['lignes_devis']['Insert'];

// Adapter les anciens types pour compatibilité
export interface Client extends Omit<ClientDB, 'created_at' | 'updated_at'> {
  createdAt: Date;
}

export interface Product extends Omit<ProductDB, 'created_at' | 'updated_at' | 'categorie_id'> {
  categorie?: string; // Nom de catégorie au lieu d'ID
  unite?: string; // Calculé automatiquement
}

export interface DevisLine {
  id: string;
  productCode: string;
  designation: string;
  quantite: number;
  prixUnitaire: number;
  prixAchat?: number;
  remise: number;
  tva: number;
  colissage?: number;
  
  // Calculs automatiques
  prixApresRemise?: number;
  totalHT?: number;
  totalTVA?: number;
  totalTTC?: number;
  margeEuros?: number;
  margePourcent?: number;
}

export interface Devis {
  id: string;
  numero: string;
  date: Date;
  dateValidite: Date;
  clientId: string;
  clientNom?: string;
  lignes: DevisLine[];
  status: 'brouillon' | 'envoye' | 'accepte' | 'refuse' | 'expire';
  totalHT: number;
  totalTTC: number;
  margeGlobale: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}