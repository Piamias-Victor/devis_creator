import { Product } from "@/types";
import { REAL_PRODUCTS, REAL_PRODUCT_CATEGORIES } from "@/data/products/realProducts";

const STORAGE_KEY = "devis_creator_products";

/**
 * Gestionnaire de stockage localStorage pour les produits
 * NETTOYÉ - Utilise UNIQUEMENT la base réelle de 86 produits Molicare
 */
export class ProductStorage {
  /**
   * Récupère tous les produits du localStorage
   */
  static getProducts(): Product[] {
    // Vérification côté client uniquement
    if (typeof window === "undefined") return REAL_PRODUCTS;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        // Initialiser avec la base RÉELLE uniquement
        this.saveProducts(REAL_PRODUCTS);
        return REAL_PRODUCTS;
      }
      return JSON.parse(stored);
    } catch (error) {
      console.error("Erreur lecture produits:", error);
      return REAL_PRODUCTS;
    }
  }

  /**
   * Sauvegarde tous les produits en localStorage
   */
  static saveProducts(products: Product[]): void {
    if (typeof window === "undefined") return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (error) {
      console.error("Erreur sauvegarde produits:", error);
    }
  }

  /**
   * Recherche produits optimisée pour codes EAN 13 chiffres
   */
  static searchProducts(query: string): Product[] {
    const products = this.getProducts();
    const searchTerm = query.toLowerCase().trim();
    
    if (!searchTerm) return products;
    
    return products.filter(product =>
      product.designation.toLowerCase().includes(searchTerm) ||
      product.code.includes(searchTerm) ||
      product.categorie.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * Filtre produits par catégorie réelle
   */
  static filterByCategory(category: string): Product[] {
    const products = this.getProducts();
    if (!category) return products;
    
    return products.filter(product => product.categorie === category);
  }

  /**
   * Récupère un produit par son code EAN
   */
  static getProductByCode(code: string): Product | null {
    const products = this.getProducts();
    return products.find(product => product.code === code) || null;
  }

  /**
   * Récupère les catégories réelles Molicare
   */
  static getCategories(): string[] {
    return [...REAL_PRODUCT_CATEGORIES];
  }

  /**
   * Tri des produits avec gestion des marges réelles
   */
  static sortProducts(products: Product[], sortBy: 'name' | 'price' | 'margin'): Product[] {
    return [...products].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.designation.localeCompare(b.designation);
        case 'price':
          return a.prixVente - b.prixVente;
        case 'margin':
          const margeA = ((a.prixVente - a.prixAchat) / a.prixAchat) * 100;
          const margeB = ((b.prixVente - b.prixAchat) / b.prixAchat) * 100;
          return margeB - margeA;
        default:
          return 0;
      }
    });
  }

  /**
   * Statistiques de la base réelle Molicare
   */
  static getProductStats(): {
    total: number;
    categories: number;
    margeGlobaleMoyenne: number;
    prixMoyen: number;
  } {
    const products = REAL_PRODUCTS;
    
    const total = products.length;
    const categories = REAL_PRODUCT_CATEGORIES.length;
    
    const margeGlobaleMoyenne = products.reduce((sum, product) => {
      const marge = ((product.prixVente - product.prixAchat) / product.prixAchat) * 100;
      return sum + marge;
    }, 0) / products.length;
    
    const prixMoyen = products.reduce((sum, product) => sum + product.prixVente, 0) / products.length;
    
    return {
      total,
      categories,
      margeGlobaleMoyenne,
      prixMoyen
    };
  }
}