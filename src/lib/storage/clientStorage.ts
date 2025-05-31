import { Client } from "@/types";
import { MOCK_CLIENTS } from "@/data/mockData";

const STORAGE_KEY = "devis_creator_clients";

/**
 * Gestionnaire de stockage localStorage pour les clients
 * Initialise avec données de test si vide
 */
export class ClientStorage {
  /**
   * Récupère tous les clients du localStorage
   */
  static getClients(): Client[] {
    // Vérification côté client uniquement
    if (typeof window === "undefined") return [];
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        // Initialiser avec les données de test
        this.saveClients(MOCK_CLIENTS);
        return MOCK_CLIENTS;
      }
      const clients = JSON.parse(stored);
      // Conversion des dates depuis JSON
      return clients.map((client: any) => ({
        ...client,
        createdAt: new Date(client.createdAt)
      }));
    } catch (error) {
      console.error("Erreur lecture clients:", error);
      return MOCK_CLIENTS;
    }
  }

  /**
   * Sauvegarde tous les clients en localStorage
   */
  static saveClients(clients: Client[]): void {
    if (typeof window === "undefined") return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
    } catch (error) {
      console.error("Erreur sauvegarde clients:", error);
    }
  }

  /**
   * Ajoute un nouveau client
   */
  static addClient(client: Omit<Client, "id" | "createdAt">): Client {
    const newClient: Client = {
      ...client,
      id: `CLI${Date.now()}`,
      createdAt: new Date(),
    };
    
    const clients = this.getClients();
    clients.push(newClient);
    this.saveClients(clients);
    
    return newClient;
  }

  /**
   * Met à jour un client existant
   */
  static updateClient(id: string, updates: Partial<Client>): Client | null {
    const clients = this.getClients();
    const index = clients.findIndex(c => c.id === id);
    
    if (index === -1) return null;
    
    clients[index] = { ...clients[index], ...updates };
    this.saveClients(clients);
    
    return clients[index];
  }

  /**
   * Supprime un client
   */
  static deleteClient(id: string): boolean {
    const clients = this.getClients();
    const filtered = clients.filter(c => c.id !== id);
    
    if (filtered.length === clients.length) return false;
    
    this.saveClients(filtered);
    return true;
  }

  /**
   * Recherche clients par nom ou SIRET
   */
  static searchClients(query: string): Client[] {
    const clients = this.getClients();
    const searchTerm = query.toLowerCase().trim();
    
    if (!searchTerm) return clients;
    
    return clients.filter(client =>
      client.nom.toLowerCase().includes(searchTerm) ||
      client.siret.includes(searchTerm) ||
      client.adresse.toLowerCase().includes(searchTerm)
    );
  }
}