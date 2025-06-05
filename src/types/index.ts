/**
 * Types principaux de l'application ÉTENDUS
 * Support complet des devis sauvegardés
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

// Type de base existant
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

// NOUVEAU : Type pour création produit (format simplifiedProducts.ts)
export interface ProductCreateInput {
  code: string;
  designation: string;
  prixAchat: number;
  tva: number;
  colissage: number;
  // unite et categorie calculés automatiquement
  // prixVente calculé automatiquement (marge 10%)
}

// Utilitaire de conversion ProductCreateInput -> Product
export function createProductFromInput(input: ProductCreateInput): Product {
  // Calcul prix vente avec marge 10%
  const prixVente = input.prixAchat * 1.10;
  
  // Détermination automatique de l'unité
  const unite = input.designation.toLowerCase().includes('bte') ||
                input.designation.toLowerCase().includes('boîte') ? 'boîte' : 'pièce';
  
  // Détermination automatique de la catégorie
  let categorie = "Incontinence"; // Par défaut
  
  if (input.designation.toLowerCase().includes('gant')) {
    categorie = "Hygiène";
  } else if (input.designation.toLowerCase().includes('bavoir')) {
    categorie = "Hygiène";
  } else if (input.designation.toLowerCase().includes('bed mat') || 
             input.designation.toLowerCase().includes('alèse')) {
    categorie = "Alèses";
  } else if (input.designation.toLowerCase().includes('mobile')) {
    categorie = "Sous-vêtements absorbants";
  } else if (input.designation.toLowerCase().includes('elastic')) {
    categorie = "Changes complets";
  }
  
  return {
    code: input.code,
    designation: input.designation,
    prixAchat: input.prixAchat,
    prixVente: Math.round(prixVente * 10000) / 10000, // Arrondi 4 décimales
    unite,
    categorie,
    colissage: input.colissage,
    tva: input.tva
  };
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
  
  // Calculs automatiques
  prixApresRemise?: number;  // Prix après remise
  totalHT?: number;          // Qté × PrixApresRemise
  totalTVA?: number;         // TotalHT × TVA/100
  totalTTC?: number;         // TotalHT + TotalTVA
  margeEuros?: number;       // (PrixApresRemise - PrixAchat) × Qté
  margePourcent?: number;    // MargeEuros / (PrixAchat × Qté) × 100
}

// NOUVEAU : Interface Devis complète
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
  calculations?: any;
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

// NOUVEAU : États de formulaire devis
export interface DevisFormState {
  isEditing: boolean;
  isDirty: boolean; // Modifications non sauvegardées
  lastSaved?: Date;
  autoSaveEnabled: boolean;
}

// NOUVEAU : Options d'export
export interface DevisExportOptions {
  includeMarges: boolean;
  includeDetails: boolean;
  format: 'pdf' | 'excel' | 'csv';
  template: 'standard' | 'minimal' | 'detaille';
}