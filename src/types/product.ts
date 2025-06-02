/**
 * Types produits SIMPLIFIÉS - Version refactorisée
 * Suppression catégorie + calcul automatique prix vente (marge 10%)
 */

export interface Product {
  code: string;           // Code EAN ou référence
  designation: string;    // Nom du produit
  prixAchat: number;     // Prix d'achat HT
  tva: number;           // Taux TVA (généralement 20)
  colissage: number;     // Nombre d'unités par colis
  
  // Champs calculés automatiquement
  prixVente?: number;    // Calculé avec marge 10%
  createdAt?: Date;      // Date de création
  updatedAt?: Date;      // Date de modification
}

// Interface pour la création (sans champs calculés)
export interface ProductCreateInput {
  code: string;
  designation: string;
  prixAchat: number;
  tva: number;
  colissage: number;
}

// Interface pour la modification
export interface ProductUpdateInput extends Partial<ProductCreateInput> {
  code: string; // Code obligatoire pour identification
}

/**
 * Utilitaires de calcul pour les produits
 */
export class ProductUtils {
  
  /**
   * Calcule le prix de vente avec marge 10%
   */
  static calculatePrixVente(prixAchat: number): number {
    return Math.round((prixAchat * 1.10) * 10000) / 10000; // 4 décimales
  }
  
  /**
   * Calcule la marge en pourcentage
   */
  static calculateMargePercent(prixVente: number, prixAchat: number): number {
    if (prixAchat === 0) return 0;
    return ((prixVente - prixAchat) / prixAchat) * 100;
  }
  
  /**
   * Calcule la marge en euros
   */
  static calculateMargeEuros(prixVente: number, prixAchat: number): number {
    return prixVente - prixAchat;
  }
  
  /**
   * Enrichit un produit avec les champs calculés
   */
  static enrichProduct(productInput: ProductCreateInput): Product {
    const now = new Date();
    
    return {
      ...productInput,
      prixVente: this.calculatePrixVente(productInput.prixAchat),
      createdAt: now,
      updatedAt: now
    };
  }
  
  /**
   * Met à jour un produit existant
   */
  static updateProduct(existingProduct: Product, updates: ProductUpdateInput): Product {
    const updated = { ...existingProduct, ...updates };
    
    // Recalculer le prix de vente si le prix d'achat a changé
    if (updates.prixAchat !== undefined) {
      updated.prixVente = this.calculatePrixVente(updates.prixAchat);
    }
    
    updated.updatedAt = new Date();
    
    return updated;
  }
  
  /**
   * Valide les données d'un produit
   */
  static validateProduct(product: ProductCreateInput): string[] {
    const errors: string[] = [];
    
    if (!product.code?.trim()) {
      errors.push("Le code produit est obligatoire");
    }
    
    if (!product.designation?.trim()) {
      errors.push("La désignation est obligatoire");
    }
    
    if (product.prixAchat <= 0) {
      errors.push("Le prix d'achat doit être supérieur à 0");
    }
    
    if (product.tva < 0 || product.tva > 100) {
      errors.push("Le taux de TVA doit être entre 0 et 100");
    }
    
    if (product.colissage <= 0 || !Number.isInteger(product.colissage)) {
      errors.push("Le colissage doit être un nombre entier positif");
    }
    
    return errors;
  }
}

/**
 * Options de tri pour les produits
 */
export type ProductSortBy = 'designation' | 'code' | 'prixAchat' | 'prixVente' | 'createdAt';

/**
 * Interface pour les filtres de recherche
 */
export interface ProductFilters {
  searchQuery?: string;
  minPrix?: number;
  maxPrix?: number;
  tvaOnly?: number; // Filtrer par taux de TVA spécifique
}