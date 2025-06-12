import { supabase } from "@/lib/database/supabase";

/**
 * Service pour récupérer les statistiques depuis Supabase
 * Câblé directement sur les vraies tables
 */

export interface GlobalKPIData {
  totalDevis: number;
  chiffreAffaires: number;
  margeMoyenneEuros: number;
  margeMoyennePourcent: number;
  tauxConversion: number;
  panierMoyen: number;
  devisEnAttente: number;
}

export interface StatusData {
  status: string;
  count: number;
  percentage: number;
  color: string;
}

export interface ClientData {
  nom: string;
  chiffreAffaires: number;
  nbDevis: number;
}

export interface UserStatsData {
  utilisateur: string;
  nbDevis: number;
  chiffreAffaires: number;
  margeMoyenne: number;
  tauxConversion: number;
  panierMoyen: number;
}

export class StatsService {
  
  /**
   * Récupérer les KPI globaux depuis Supabase
   */
  static async getGlobalKPIs(): Promise<GlobalKPIData> {
    try {
      console.log("📊 Récupération KPI globaux...");

      // Récupérer tous les devis avec leurs totaux
      const { data: devisData, error } = await supabase
        .from('devis')
        .select('status, total_ttc, total_ht, marge_globale_euros, marge_globale_pourcent');

      if (error) {
        console.error("❌ Erreur récupération devis:", error);
        throw error;
      }

      if (!devisData || devisData.length === 0) {
        console.log("⚠️ Aucun devis trouvé");
        return {
          totalDevis: 0,
          chiffreAffaires: 0,
          margeMoyenneEuros: 0,
          margeMoyennePourcent: 0,
          tauxConversion: 0,
          panierMoyen: 0,
          devisEnAttente: 0
        };
      }

      console.log(`📋 ${devisData.length} devis trouvés`);

      // Calculs des KPI
      const totalDevis = devisData.length;
      
      // Devis acceptés seulement pour le CA
      const devisAcceptes = devisData.filter(d => d.status === 'accepte');
      const nbDevisAcceptes = devisAcceptes.length;
      
      // Chiffre d'affaires (total TTC des devis acceptés)
      const chiffreAffaires = devisAcceptes.reduce((sum, d) => sum + (Number(d.total_ttc) || 0), 0);
      
      // Marge moyenne (tous devis confondus)
      const margesEuros = devisData.map(d => Number(d.marge_globale_euros) || 0);
      const margesPourcent = devisData.map(d => Number(d.marge_globale_pourcent) || 0);
      
      const margeMoyenneEuros = margesEuros.length > 0 
        ? margesEuros.reduce((sum, m) => sum + m, 0) / margesEuros.length 
        : 0;
        
      const margeMoyennePourcent = margesPourcent.length > 0
        ? margesPourcent.reduce((sum, m) => sum + m, 0) / margesPourcent.length
        : 0;

      // Taux de conversion (acceptés / total)
      const tauxConversion = totalDevis > 0 ? (nbDevisAcceptes / totalDevis) * 100 : 0;
      
      // Panier moyen (CA / nb devis acceptés)
      const panierMoyen = nbDevisAcceptes > 0 ? chiffreAffaires / nbDevisAcceptes : 0;
      
      // Devis en attente (statut 'envoye')
      const devisEnAttente = devisData.filter(d => d.status === 'envoye').length;

      const kpis = {
        totalDevis,
        chiffreAffaires,
        margeMoyenneEuros,
        margeMoyennePourcent,
        tauxConversion,
        panierMoyen,
        devisEnAttente
      };

      console.log("✅ KPI calculés:", kpis);
      return kpis;

    } catch (error) {
      console.error("❌ Erreur service KPI:", error);
      throw new Error("Impossible de récupérer les statistiques");
    }
  }

  /**
   * Récupérer la répartition des statuts pour le graphique donut
   */
  static async getStatusDistribution(): Promise<StatusData[]> {
    try {
      console.log("📊 Récupération répartition statuts...");

      const { data: devisData, error } = await supabase
        .from('devis')
        .select('status');

      if (error) {
        console.error("❌ Erreur récupération statuts:", error);
        throw error;
      }

      if (!devisData || devisData.length === 0) {
        return [];
      }

      // Compter par statut
      const statusCounts: Record<string, number> = {};
      devisData.forEach(devis => {
        const status = devis.status || 'brouillon';
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });

      const total = devisData.length;

      // Configuration des couleurs par statut
      const statusColors: Record<string, string> = {
        'brouillon': '#6B7280',
        'envoye': '#F59E0B', 
        'accepte': '#10B981',
        'refuse': '#EF4444',
        'expire': '#8B5CF6'
      };

      // Noms français pour l'affichage
      const statusLabels: Record<string, string> = {
        'brouillon': 'Brouillons',
        'envoye': 'Envoyés',
        'accepte': 'Acceptés',
        'refuse': 'Refusés',
        'expire': 'Expirés'
      };

      // Transformer en données pour le graphique
      const statusData: StatusData[] = Object.entries(statusCounts).map(([status, count]) => ({
        status: statusLabels[status] || status,
        count,
        percentage: (count / total) * 100,
        color: statusColors[status] || '#6B7280'
      }));

      console.log("✅ Répartition statuts:", statusData);
      return statusData;

    } catch (error) {
      console.error("❌ Erreur service statuts:", error);
      throw new Error("Impossible de récupérer la répartition des statuts");
    }
  }

  /**
   * Récupérer le top 5 des clients par CA
   */
  static async getTopClients(): Promise<ClientData[]> {
    try {
      console.log("📊 Récupération top clients...");

      const { data: devisData, error } = await supabase
        .from('devis')
        .select(`
          client_id,
          total_ttc,
          status,
          clients (nom)
        `)
        .eq('status', 'accepte'); // Seulement les devis acceptés pour le CA

      if (error) {
        console.error("❌ Erreur récupération clients:", error);
        throw error;
      }

      if (!devisData || devisData.length === 0) {
        return [];
      }

      // Grouper par client
      const clientStats: Record<string, { nom: string; ca: number; nbDevis: number }> = {};

      devisData.forEach((devis: any) => {
        const clientId = devis.client_id;
        const clientNom = devis.clients?.nom || 'Client inconnu';
        const montant = Number(devis.total_ttc) || 0;

        if (!clientStats[clientId]) {
          clientStats[clientId] = {
            nom: clientNom,
            ca: 0,
            nbDevis: 0
          };
        }

        clientStats[clientId].ca += montant;
        clientStats[clientId].nbDevis += 1;
      });

      // Trier par CA et prendre le top 5
      const topClients: ClientData[] = Object.values(clientStats)
        .sort((a, b) => b.ca - a.ca)
        .slice(0, 5)
        .map(client => ({
          nom: client.nom,
          chiffreAffaires: client.ca,
          nbDevis: client.nbDevis
        }));

      console.log("✅ Top clients:", topClients);
      return topClients;

    } catch (error) {
      console.error("❌ Erreur service top clients:", error);
      throw new Error("Impossible de récupérer le top clients");
    }
  }

  /**
   * Récupérer les statistiques par utilisateur
   */
  static async getUserStats(): Promise<UserStatsData[]> {
    try {
      console.log("📊 Récupération stats utilisateurs...");

      const { data: devisData, error } = await supabase
        .from('devis')
        .select(`
          created_by,
          status,
          total_ttc,
          marge_globale_euros,
          users!devis_created_by_fkey (nom, prenom)
        `);

      if (error) {
        console.error("❌ Erreur récupération stats users:", error);
        throw error;
      }

      if (!devisData || devisData.length === 0) {
        return [];
      }

      // Grouper par utilisateur
      const userStats: Record<string, {
        nom: string;
        totalDevis: number;
        devisAcceptes: number;
        ca: number;
        marges: number[];
      }> = {};

      devisData.forEach((devis: any) => {
        const userId = devis.created_by;
        if (!userId) return;

        const user = devis.users;
        const userName = user ? `${user.prenom || ''} ${user.nom}`.trim() : 'Utilisateur inconnu';
        
        if (!userStats[userId]) {
          userStats[userId] = {
            nom: userName,
            totalDevis: 0,
            devisAcceptes: 0,
            ca: 0,
            marges: []
          };
        }

        userStats[userId].totalDevis += 1;
        
        if (devis.status === 'accepte') {
          userStats[userId].devisAcceptes += 1;
          userStats[userId].ca += Number(devis.total_ttc) || 0;
        }

        if (devis.marge_globale_euros) {
          userStats[userId].marges.push(Number(devis.marge_globale_euros));
        }
      });

      // Transformer en tableau avec calculs
      const userStatsArray: UserStatsData[] = Object.entries(userStats).map(([userId, stats]) => {
        const margeMoyenne = stats.marges.length > 0 
          ? stats.marges.reduce((sum, m) => sum + m, 0) / stats.marges.length 
          : 0;

        const tauxConversion = stats.totalDevis > 0 
          ? (stats.devisAcceptes / stats.totalDevis) * 100 
          : 0;

        const panierMoyen = stats.devisAcceptes > 0 
          ? stats.ca / stats.devisAcceptes 
          : 0;

        return {
          utilisateur: stats.nom,
          nbDevis: stats.totalDevis,
          chiffreAffaires: stats.ca,
          margeMoyenne,
          tauxConversion,
          panierMoyen
        };
      });

      // Trier par CA décroissant
      userStatsArray.sort((a, b) => b.chiffreAffaires - a.chiffreAffaires);

      console.log("✅ Stats utilisateurs:", userStatsArray);
      return userStatsArray;

    } catch (error) {
      console.error("❌ Erreur service stats users:", error);
      throw new Error("Impossible de récupérer les statistiques utilisateurs");
    }
  }
  static formatEuros(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  /**
   * Formater un pourcentage
   */
  static formatPourcent(percent: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(percent / 100);
  }
}