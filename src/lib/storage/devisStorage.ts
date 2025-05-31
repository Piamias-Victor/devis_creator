import { Devis } from "@/types";

const STORAGE_KEY = "devis_creator_devis";

/**
 * Gestionnaire de stockage localStorage pour les devis
 * CRUD complet avec historique
 */
export class DevisStorage {
  /**
   * Récupère tous les devis du localStorage
   */
  static getDevis(): Devis[] {
    if (typeof window === "undefined") return [];
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      
      const devis = JSON.parse(stored);
      // Conversion des dates depuis JSON
      return devis.map((d: any) => ({
        ...d,
        date: new Date(d.date),
        dateValidite: new Date(d.dateValidite),
        createdAt: new Date(d.createdAt),
        updatedAt: new Date(d.updatedAt)
      }));
    } catch (error) {
      console.error("Erreur lecture devis:", error);
      return [];
    }
  }

  /**
   * Sauvegarde tous les devis en localStorage
   */
  static saveDevis(devis: Devis[]): void {
    if (typeof window === "undefined") return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(devis));
    } catch (error) {
      console.error("Erreur sauvegarde devis:", error);
    }
  }

  /**
   * Ajoute un nouveau devis
   */
  static addDevis(devis: Omit<Devis, "createdAt" | "updatedAt">): Devis {
    const now = new Date();
    const newDevis: Devis = {
      ...devis,
      createdAt: now,
      updatedAt: now,
    };
    
    const allDevis = this.getDevis();
    allDevis.push(newDevis);
    this.saveDevis(allDevis);
    
    return newDevis;
  }

  /**
   * Met à jour un devis existant
   */
  static updateDevis(id: string, updates: Partial<Devis>): Devis | null {
    const allDevis = this.getDevis();
    const index = allDevis.findIndex(d => d.id === id);
    
    if (index === -1) return null;
    
    allDevis[index] = { 
      ...allDevis[index], 
      ...updates, 
      updatedAt: new Date() 
    };
    this.saveDevis(allDevis);
    
    return allDevis[index];
  }

  /**
   * Supprime un devis
   */
  static deleteDevis(id: string): boolean {
    const allDevis = this.getDevis();
    const filtered = allDevis.filter(d => d.id !== id);
    
    if (filtered.length === allDevis.length) return false;
    
    this.saveDevis(filtered);
    return true;
  }

  /**
   * Récupère un devis par ID
   */
  static getDevisById(id: string): Devis | null {
    const allDevis = this.getDevis();
    return allDevis.find(d => d.id === id) || null;
  }

  /**
   * Génère un ID unique pour devis
   */
  static generateId(): string {
    return `devis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}