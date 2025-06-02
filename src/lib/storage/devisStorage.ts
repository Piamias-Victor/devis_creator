import { Devis, DevisLine, Client, DevisCalculations } from "@/types";

const STORAGE_KEY = "devis_creator_devis";

/**
 * Gestionnaire de stockage localStorage pour les devis
 * CRUD complet avec recherche et statistiques
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
  static addDevis(devisData: {
    numero: string;
    date: Date;
    dateValidite: Date;
    client: Client;
    lignes: DevisLine[];
    calculations: DevisCalculations;
  }): Devis {
    const now = new Date();
    const newDevis: Devis = {
      id: this.generateId(),
      numero: devisData.numero,
      date: devisData.date,
      dateValidite: devisData.dateValidite,
      clientId: devisData.client.id,
      clientNom: devisData.client.nom, // Pour affichage rapide
      lignes: devisData.lignes,
      status: 'brouillon',
      totalHT: devisData.calculations.totalHT,
      totalTTC: devisData.calculations.totalTTC,
      margeGlobale: devisData.calculations.margeGlobalePourcent,
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
   * Duplique un devis existant
   */
  static duplicateDevis(id: string): Devis | null {
    const originalDevis = this.getDevisById(id);
    if (!originalDevis) return null;
    
    const now = new Date();
    const duplicatedDevis: Devis = {
      ...originalDevis,
      id: this.generateId(),
      numero: this.generateNewNumber(),
      date: now,
      dateValidite: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // +30 jours
      status: 'brouillon',
      createdAt: now,
      updatedAt: now,
    };
    
    const allDevis = this.getDevis();
    allDevis.push(duplicatedDevis);
    this.saveDevis(allDevis);
    
    return duplicatedDevis;
  }

  /**
   * Recherche devis par terme
   */
  static searchDevis(query: string): Devis[] {
    const allDevis = this.getDevis();
    const searchTerm = query.toLowerCase().trim();
    
    if (!searchTerm) return allDevis;
    
    return allDevis.filter(devis =>
      devis.numero.toLowerCase().includes(searchTerm) ||
      devis.clientNom?.toLowerCase().includes(searchTerm) ||
      devis.status.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * Filtre devis par statut
   */
  static filterByStatus(status: string): Devis[] {
    const allDevis = this.getDevis();
    if (!status) return allDevis;
    
    return allDevis.filter(devis => devis.status === status);
  }

  /**
   * Génère un ID unique pour devis
   */
  static generateId(): string {
    return `devis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Génère un nouveau numéro de devis
   */
  static generateNewNumber(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const sequence = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
    
    return `${year}-${month}${day}-${sequence}`;
  }

  /**
   * Statistiques des devis
   */
  static getDevisStats(): {
    total: number;
    brouillons: number;
    envoyes: number;
    acceptes: number;
    chiffreAffaireMensuel: number;
    margeGlobaleMoyenne: number;
  } {
    const allDevis = this.getDevis();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const devisDuMois = allDevis.filter(d => 
      d.date.getMonth() === currentMonth && d.date.getFullYear() === currentYear
    );
    
    return {
      total: allDevis.length,
      brouillons: allDevis.filter(d => d.status === 'brouillon').length,
      envoyes: allDevis.filter(d => d.status === 'envoye').length,
      acceptes: allDevis.filter(d => d.status === 'accepte').length,
      chiffreAffaireMensuel: devisDuMois
        .filter(d => d.status === 'accepte')
        .reduce((sum, d) => sum + d.totalTTC, 0),
      margeGlobaleMoyenne: allDevis.length > 0 
        ? allDevis.reduce((sum, d) => sum + d.margeGlobale, 0) / allDevis.length 
        : 0
    };
  }
}