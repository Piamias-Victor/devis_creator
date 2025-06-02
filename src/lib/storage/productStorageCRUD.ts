import { Product, ProductCreateInput, ProductUpdateInput, ProductUtils, ProductFilters, ProductSortBy } from "@/types/product";
import { SIMPLIFIED_PRODUCTS } from "@/data/products/simplifiedProducts";

const STORAGE_KEY = "devis_creator_products_v2";

/**
 * Gestionnaire CRUD complet pour les produits
 * Version simplifiée avec calcul automatique marge 10%
 */
export class ProductStorageCRUD {
  
  /**
   * Récupère tous les produits avec enrichissement
   */
  static getProducts(): Product[] {
    if (typeof window === "undefined") return SIMPLIFIED_PRODUCTS.map(p => ProductUtils.enrichProduct(p));
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      
      if (!stored) {
        // Initialisation avec les produits existants enrichis
        const enrichedProducts = SIMPLIFIED_PRODUCTS.map(p => ProductUtils.enrichProduct(p));
        this.saveProducts(enrichedProducts);
        return enrichedProducts;
      }
      
      const products = JSON.parse(stored);
      
      // Reconstituer les dates
      return products.map((p: any) => ({
        ...p,
        createdAt: p.createdAt ? new Date(p.createdAt) : new Date(),
        updatedAt: p.updatedAt ? new Date(p.updatedAt) : new Date()
      }));
      
    } catch (error) {
      console.error("Erreur lecture produits:", error);
      return SIMPLIFIED_PRODUCTS.map(p => ProductUtils.enrichProduct(p));
    }
  }
  
  /**
   * Sauvegarde tous les produits
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
   * Ajoute un nouveau produit
   */
  static addProduct(productInput: ProductCreateInput): Product {
    // Validation
    const errors = ProductUtils.validateProduct(productInput);
    if (errors.length > 0) {
      throw new Error(`Erreurs de validation: ${errors.join(', ')}`);
    }
    
    // Vérifier unicité du code
    const existingProducts = this.getProducts();
    const codeExists = existingProducts.some(p => p.code === productInput.code);
    
    if (codeExists) {
      throw new Error(`Un produit avec le code "${productInput.code}" existe déjà`);
    }
    
    // Enrichir et ajouter
    const newProduct = ProductUtils.enrichProduct(productInput);
    const allProducts = [...existingProducts, newProduct];
    
    this.saveProducts(allProducts);
    return newProduct;
  }
  
  /**
   * Met à jour un produit existant
   */
  static updateProduct(code: string, updates: Omit<ProductUpdateInput, 'code'>): Product {
    const allProducts = this.getProducts();
    const index = allProducts.findIndex(p => p.code === code);
    
    if (index === -1) {
      throw new Error(`Produit avec le code "${code}" introuvable`);
    }
    
    // Validation des updates
    const updatedData = { code, ...updates };
    const errors = ProductUtils.validateProduct(updatedData as ProductCreateInput);
    if (errors.length > 0) {
      throw new Error(`Erreurs de validation: ${errors.join(', ')}`);
    }
    
    // Mettre à jour
    const updatedProduct = ProductUtils.updateProduct(allProducts[index], { code, ...updates });
    allProducts[index] = updatedProduct;
    
    this.saveProducts(allProducts);
    return updatedProduct;
  }
  
  /**
   * Supprime un produit
   */
  static deleteProduct(code: string): boolean {
    const allProducts = this.getProducts();
    const filteredProducts = allProducts.filter(p => p.code !== code);
    
    if (filteredProducts.length === allProducts.length) {
      return false; // Produit non trouvé
    }
    
    this.saveProducts(filteredProducts);
    return true;
  }
  
  /**
   * Récupère un produit par code
   */
  static getProductByCode(code: string): Product | null {
    const products = this.getProducts();
    return products.find(p => p.code === code) || null;
  }
  
  /**
   * Recherche produits avec filtres
   */
  static searchProducts(filters: ProductFilters = {}): Product[] {
    let products = this.getProducts();
    
    // Filtre par recherche textuelle
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase().trim();
      products = products.filter(p =>
        p.designation.toLowerCase().includes(query) ||
        p.code.toLowerCase().includes(query)
      );
    }
    
    // Filtre par prix minimum
    if (filters.minPrix !== undefined) {
      products = products.filter(p => (p.prixVente || 0) >= filters.minPrix!);
    }
    
    // Filtre par prix maximum
    if (filters.maxPrix !== undefined) {
      products = products.filter(p => (p.prixVente || 0) <= filters.maxPrix!);
    }
    
    // Filtre par TVA
    if (filters.tvaOnly !== undefined) {
      products = products.filter(p => p.tva === filters.tvaOnly);
    }
    
    return products;
  }
  
  /**
   * Tri des produits
   */
  static sortProducts(products: Product[], sortBy: ProductSortBy, ascending = true): Product[] {
    return [...products].sort((a, b) => {
      let valueA: any;
      let valueB: any;
      
      switch (sortBy) {
        case 'designation':
          valueA = a.designation.toLowerCase();
          valueB = b.designation.toLowerCase();
          break;
        case 'code':
          valueA = a.code.toLowerCase();
          valueB = b.code.toLowerCase();
          break;
        case 'prixAchat':
          valueA = a.prixAchat;
          valueB = b.prixAchat;
          break;
        case 'prixVente':
          valueA = a.prixVente || 0;
          valueB = b.prixVente || 0;
          break;
        case 'createdAt':
          valueA = a.createdAt?.getTime() || 0;
          valueB = b.createdAt?.getTime() || 0;
          break;
        default:
          return 0;
      }
      
      if (valueA < valueB) return ascending ? -1 : 1;
      if (valueA > valueB) return ascending ? 1 : -1;
      return 0;
    });
  }
  
  /**
   * Statistiques des produits
   */
  static getProductStats(): {
    total: number;
    prixMoyenAchat: number;
    prixMoyenVente: number;
    margeMoyenne: number;
    totalStock: number;
  } {
    const products = this.getProducts();
    
    if (products.length === 0) {
      return {
        total: 0,
        prixMoyenAchat: 0,
        prixMoyenVente: 0,
        margeMoyenne: 0,
        totalStock: 0
      };
    }
    
    const totalAchat = products.reduce((sum, p) => sum + p.prixAchat, 0);
    const totalVente = products.reduce((sum, p) => sum + (p.prixVente || 0), 0);
    const totalMarges = products.reduce((sum, p) => {
      const marge = ProductUtils.calculateMargePercent(p.prixVente || 0, p.prixAchat);
      return sum + marge;
    }, 0);
    
    return {
      total: products.length,
      prixMoyenAchat: totalAchat / products.length,
      prixMoyenVente: totalVente / products.length,
      margeMoyenne: totalMarges / products.length,
      totalStock: products.reduce((sum, p) => sum + p.colissage, 0)
    };
  }
  
  /**
   * Export des produits en CSV
   */
  static exportToCSV(): string {
    const products = this.getProducts();
    
    const headers = ["Code", "Designation", "Prix Achat", "Prix Vente", "TVA", "Colissage"];
    const rows = products.map(p => [
      p.code,
      p.designation,
      p.prixAchat.toFixed(4),
      (p.prixVente || 0).toFixed(4),
      p.tva.toString(),
      p.colissage.toString()
    ]);
    
    return [headers, ...rows].map(row => row.join(",")).join("\n");
  }
  
  /**
   * Réinitialise avec les produits par défaut
   */
  static resetToDefault(): void {
    if (typeof window === "undefined") return;
    
    localStorage.removeItem(STORAGE_KEY);
    console.log("🔄 Produits réinitialisés aux valeurs par défaut");
  }
}