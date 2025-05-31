import { Product } from "@/types";
import { MOCK_PRODUCTS } from "@/data/products/mockProducts";

const STORAGE_KEY = "devis_creator_products";

/**
 * Gestionnaire de stockage localStorage pour les produits
 * Initialise avec base de données hardcodée
 */
export class ProductStorage {
  /**
   * Récupère tous les produits du localStorage
   */
  static getProducts(): Product[] {
    // Vérification côté client uniquement
    if (typeof window === "undefined") return MOCK_PRODUCTS;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        // Initialiser avec les données hardcodées
        this.saveProducts(MOCK_PRODUCTS);
        return MOCK_PRODUCTS;
      }
      return JSON.parse(stored);
    } catch (error) {
      console.error("Erreur lecture produits:", error);
      return MOCK_PRODUCTS;
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
   * Recherche produits par terme
   */
  static searchProducts(query: string): Product[] {
    const products = this.getProducts();
    const searchTerm = query.toLowerCase().trim();
    
    if (!searchTerm) return products;
    
    return products.filter(product =>
      product.designation.toLowerCase().includes(searchTerm) ||
      product.code.toLowerCase().includes(searchTerm) ||
      product.categorie.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * Filtre produits par catégorie
   */
  static filterByCategory(category: string): Product[] {
    const products = this.getProducts();
    if (!category) return products;
    
    return products.filter(product => 
      product.categorie.toLowerCase() === category.toLowerCase()
    );
  }

  /**
   * Récupère un produit par son code
   */
  static getProductByCode(code: string): Product | null {
    const products = this.getProducts();
    return products.find(product => product.code === code) || null;
  }

  /**
   * Récupère les catégories disponibles
   */
  static getCategories(): string[] {
    const products = this.getProducts();
    const categories = [...new Set(products.map(p => p.categorie))];
    return categories.sort();
  }

  /**
   * Tri des produits
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
          return margeB - margeA; // Tri décroissant des marges
        default:
          return 0;
      }
    });
  }

  /**
   * Statistiques des produits
   */
  static getProductStats(): {
    total: number;
    categories: number;
    margeGlobaleMoyenne: number;
    prixMoyen: number;
  } {
    const products = this.getProducts();
    
    const total = products.length;
    const categories = this.getCategories().length;
    
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