import { Product, ProductCreateInput, createProductFromInput } from "@/types";
import { SIMPLIFIED_PRODUCTS, PRODUCT_DEFAULTS } from "@/data/products/simplifiedProducts";

const STORAGE_KEY = "devis_creator_products";

/**
 * ProductStorage FINAL - Support simplifiedProducts.ts
 * Conversion automatique ProductCreateInput -> Product
 */
export class ProductStorage {
  private static initialized = false;
  private static convertedProducts: Product[] = [];

  /**
   * Convertit les SIMPLIFIED_PRODUCTS vers Product[]
   */
  private static convertSimplifiedProducts(): Product[] {
    if (this.convertedProducts.length > 0) {
      return this.convertedProducts;
    }

    console.log("🔄 Conversion SIMPLIFIED_PRODUCTS vers Product[]");
    
    this.convertedProducts = SIMPLIFIED_PRODUCTS.map(input => 
      createProductFromInput(input)
    );
    
    console.log(`✅ ${this.convertedProducts.length} produits convertis`);
    return this.convertedProducts;
  }

  /**
   * Récupère tous les produits convertis
   */
  static getProducts(): Product[] {
    if (typeof window === "undefined") {
      return this.convertSimplifiedProducts();
    }
    
    // FORCER UNE SEULE FOIS la conversion
    if (!this.initialized) {
      console.log("🚀 INITIALISATION SIMPLIFIED_PRODUCTS");
      const converted = this.convertSimplifiedProducts();
      localStorage.removeItem(STORAGE_KEY); // Vider ancien cache
      this.saveProducts(converted);
      this.initialized = true;
      return converted;
    }
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        const converted = this.convertSimplifiedProducts();
        this.saveProducts(converted);
        return converted;
      }
      
      const products = JSON.parse(stored);
      
      // VALIDATION : Nombre de produits attendu
      const expectedCount = SIMPLIFIED_PRODUCTS.length;
      if (products.length !== expectedCount) {
        console.log(`⚠️ Cache incorrect (${products.length}/${expectedCount}), reconversion`);
        const converted = this.convertSimplifiedProducts();
        this.saveProducts(converted);
        return converted;
      }
      
      return products;
    } catch (error) {
      console.error("❌ Erreur lecture produits:", error);
      const converted = this.convertSimplifiedProducts();
      this.saveProducts(converted);
      return converted;
    }
  }

  static saveProducts(products: Product[]): void {
    if (typeof window === "undefined") return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
      console.log(`✅ ${products.length} produits sauvegardés`);
    } catch (error) {
      console.error("❌ Erreur sauvegarde:", error);
    }
  }

  /**
   * DIAGNOSTIC complet
   */
  static diagnostic(): void {
    const simplified = SIMPLIFIED_PRODUCTS.length;
    const converted = this.getProducts().length;
    const categories = this.getCategories().length;
    
    console.log("=== DIAGNOSTIC SIMPLIFIED_PRODUCTS ===");
    console.log(`Source SIMPLIFIED_PRODUCTS: ${simplified}`);
    console.log(`Produits convertis: ${converted}`);
    console.log(`Catégories détectées: ${categories}`);
    console.log(`Premier produit: ${SIMPLIFIED_PRODUCTS[0]?.designation}`);
    console.log(`Prix vente calculé: ${this.getProducts()[0]?.prixVente}`);
    console.log("======================================");
  }

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

  static getProductByCode(code: string): Product | null {
    return this.getProducts().find(p => p.code === code) || null;
  }

  /**
   * Catégories auto-détectées depuis les produits convertis
   */
  static getCategories(): string[] {
    const products = this.getProducts();
    const categoriesSet = new Set(products.map(p => p.categorie));
    return Array.from(categoriesSet).sort();
  }

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

  static getProductStats() {
    const products = this.getProducts();
    
    if (products.length === 0) {
      return { total: 0, categories: 0, margeGlobaleMoyenne: 0, prixMoyen: 0 };
    }
    
    const margeGlobaleMoyenne = products.reduce((sum, p) => {
      return sum + ((p.prixVente - p.prixAchat) / p.prixAchat) * 100;
    }, 0) / products.length;
    
    const prixMoyen = products.reduce((sum, p) => sum + p.prixVente, 0) / products.length;
    
    return {
      total: products.length,
      categories: this.getCategories().length,
      margeGlobaleMoyenne,
      prixMoyen
    };
  }
}

// DIAGNOSTIC automatique au chargement
if (typeof window !== "undefined") {
  ProductStorage.diagnostic();
}