/**
 * TYPES UNIFIÉS - SOURCE DE VÉRITÉ UNIQUE
 * Tous les autres fichiers importent depuis ici
 */

// ============================================
// TYPES CLIENT
// ============================================
export interface Client {
  id: string;
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
  siret: string;
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  nom: string;
  prenom?: string;
  role: 'admin' | 'pharmacien' | 'assistant';
  actif: boolean;
  telephone?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreateInput {
  email: string;
  nom: string;
  prenom?: string;
  role: 'admin' | 'pharmacien' | 'assistant';
  telephone?: string;
}

export interface ClientCreateInput {
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
  siret: string;
}

// ============================================
// TYPES PRODUIT UNIFIÉS
// ============================================
export interface Product {
  code: string;              // Code EAN ou référence
  designation: string;       // Nom du produit
  prixAchat: number;        // Prix d'achat HT (obligatoire)
  prixVente: number;        // Prix de vente HT (obligatoire)
  tva: number;              // Taux TVA (généralement 20)
  colissage: number;        // Nombre d'unités par colis
  categorie: string;        // Nom de la catégorie
  unite: string;            // Unité (pièce, boîte, etc.)
  createdAt?: Date;         // Date de création
  updatedAt?: Date;         // Date de modification
}

export interface ProductCreateInput {
  code: string;
  designation: string;
  prixAchat: number;
  prixVente: number;
  tva: number;
  colissage: number;
  categorie?: string;       // Optionnel, défaut "Incontinence"
}

export interface ProductUpdateInput {
  code: string;             // Obligatoire pour identification
  designation?: string;
  prixAchat?: number;
  prixVente?: number;
  tva?: number;
  colissage?: number;
  categorie?: string;
}

// ============================================
// TYPES DEVIS ET LIGNES
// ============================================
export interface DevisLine {
  id: string;
  productCode: string;
  designation: string;
  quantite: number;
  prixUnitaire: number;     // Prix de vente de base
  prixAchat?: number;       // Pour calcul marge
  remise: number;           // Pourcentage de remise
  tva: number;              // Taux TVA
  colissage?: number;       // Pour calcul nb colis
  
  // Calculs automatiques (calculés, pas stockés)
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
  status: DevisStatus;
  totalHT: number;
  totalTTC: number;
  margeGlobale: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  
  // ✅ NOUVELLES PROPRIÉTÉS TRAÇABILITÉ
  createdBy?: string;           // ID utilisateur créateur
  createdByName?: string;       // Nom complet créateur
  updatedBy?: string;           // ID dernier modificateur
  updatedByName?: string;       // Nom complet modificateur
}

export interface AuthUser {
  id: string;
  email: string;
  nom: string;
  prenom?: string;
  role: 'admin' | 'pharmacien' | 'assistant';
  fullName: string;
}

export function transformUserFromDB(userDB: any): User {
  return {
    id: userDB.id,
    email: userDB.email,
    nom: userDB.nom,
    prenom: userDB.prenom,
    role: userDB.role,
    actif: userDB.actif,
    telephone: userDB.telephone,
    createdAt: new Date(userDB.created_at),
    updatedAt: new Date(userDB.updated_at)
  };
}

export function getUserFullName(user: User | AuthUser): string {
  return `${user.prenom || ''} ${user.nom}`.trim();
}

/**
 * Vérifie les permissions selon le rôle
 */
export function getUserPermissions(role: string): AuthPermissions {
  switch (role) {
    case 'admin':
      return {
        canCreateDevis: true,
        canEditProducts: true,
        canManageUsers: true,
        canDeleteDevis: true,
        canExportData: true
      };
    case 'pharmacien':
      return {
        canCreateDevis: true,
        canEditProducts: true,
        canManageUsers: false,
        canDeleteDevis: true,
        canExportData: true
      };
    case 'assistant':
      return {
        canCreateDevis: true,
        canEditProducts: false,
        canManageUsers: false,
        canDeleteDevis: false,
        canExportData: false
      };
    default:
      return {
        canCreateDevis: false,
        canEditProducts: false,
        canManageUsers: false,
        canDeleteDevis: false,
        canExportData: false
      };
  }
}

export interface AuthPermissions {
  canCreateDevis: boolean;
  canEditProducts: boolean;
  canManageUsers: boolean;
  canDeleteDevis: boolean;
  canExportData: boolean;
}

export type DevisStatus = 'brouillon' | 'envoye' | 'accepte' | 'refuse' | 'expire';

// ============================================
// TYPES CALCULS ET STATS
// ============================================
export interface DevisCalculations {
  totalHT: number;
  totalTVA: number;
  totalTTC: number;
  margeGlobaleEuros: number;
  margeGlobalePourcent: number;
  nombreLignes: number;
  quantiteTotale: number;
}

export interface DashboardStats {
  totalDevis: number;
  chiffreAffaires: number;
  margeGlobale: number;
  clientsActifs: number;
}

export interface ProductStats {
  total: number;
  categories: number;
  margeGlobaleMoyenne: number;
  prixMoyen: number;
}

// ============================================
// TYPES FORMULAIRES ET UI
// ============================================
export interface DevisFormState {
  isEditing: boolean;
  isDirty: boolean;
  lastSaved?: Date;
  autoSaveEnabled: boolean;
}

export interface DevisExportOptions {
  includeMarges: boolean;
  includeDetails: boolean;
  format: 'pdf' | 'excel' | 'csv';
  template: 'standard' | 'minimal' | 'detaille';
}

// ============================================
// TYPES RECHERCHE ET FILTRES
// ============================================
export interface ProductFilters {
  searchQuery?: string;
  categorie?: string;
  minPrix?: number;
  maxPrix?: number;
  tvaOnly?: number;
}

export type ProductSortBy = 'designation' | 'code' | 'prixAchat' | 'prixVente' | 'categorie' | 'createdAt';

// ============================================
// TYPES DATABASE (pour Supabase)
// ============================================
export interface ProductDB {
  id: string;
  code: string;
  designation: string;
  prix_achat: number;
  prix_vente: number;
  tva: number;
  colissage: number;
  categorie_id: string;
  created_at: string;
  updated_at: string;
}

export interface ClientDB {
  id: string;
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
  siret: string;
  created_at: string;
  updated_at: string;
}

export interface DevisDB {
  id: string;
  numero: string;
  client_id: string;
  date_creation: string;
  date_validite: string;
  status: string;
  total_ht: number;
  total_ttc: number;
  marge_globale_pourcent: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// ============================================
// UTILITAIRES TYPES
// ============================================

/**
 * Transforme ProductDB en Product pour l'interface
 */
export function transformProductFromDB(
  productDB: ProductDB, 
  categoryName: string = 'Incontinence'
): Product {
  return {
    code: productDB.code,
    designation: productDB.designation,
    prixAchat: Number(productDB.prix_achat),
    prixVente: Number(productDB.prix_vente),
    tva: Number(productDB.tva),
    colissage: productDB.colissage,
    categorie: categoryName,
    unite: productDB.designation.toLowerCase().includes('bte') ? 'boîte' : 'pièce',
    createdAt: new Date(productDB.created_at),
    updatedAt: new Date(productDB.updated_at)
  };
}

/**
 * Transforme Product en données pour Supabase
 */
export function transformProductToDB(
  product: ProductCreateInput,
  categorieId: string
): Omit<ProductDB, 'id' | 'created_at' | 'updated_at'> {
  return {
    code: product.code,
    designation: product.designation,
    prix_achat: product.prixAchat,
    prix_vente: product.prixVente,
    tva: product.tva,
    colissage: product.colissage,
    categorie_id: categorieId
  };
}

/**
 * Transforme ClientDB en Client pour l'interface
 */
export function transformClientFromDB(clientDB: ClientDB): Client {
  return {
    id: clientDB.id,
    nom: clientDB.nom,
    adresse: clientDB.adresse,
    telephone: clientDB.telephone,
    email: clientDB.email,
    siret: clientDB.siret,
    createdAt: new Date(clientDB.created_at)
  };
}