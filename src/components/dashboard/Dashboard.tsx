"use client";

import { useState, useEffect } from "react";
import { StatsCard } from "./StatsCard";
import { HeroSection } from "./HeroSection";
import { 
  FileText, 
  TrendingUp, 
  DollarSign, 
  Users 
} from "lucide-react";
import { DevisRepository } from "@/lib/repositories/devisRepository";
import { supabase } from "@/lib/database/supabase";

interface DashboardStats {
  totalDevis: number;
  chiffreAffaires: number;
  margeGlobale: number;
  clientsActifs: number;
  trends: {
    devis: number;
    chiffre: number;
    marge: number;
    clients: number;
  };
}

/**
 * Dashboard avec données Supabase réelles
 * Stats dynamiques + tendances calculées
 */
export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalDevis: 0,
    chiffreAffaires: 0,
    margeGlobale: 0,
    clientsActifs: 0,
    trends: { devis: 0, chiffre: 0, marge: 0, clients: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les statistiques depuis Supabase
  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Stats des devis depuis le repository
      const devisStats = await DevisRepository.getDevisStats();

      // 2. Stats des clients actifs (ayant des devis ce mois)
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const { data: clientsData, error: clientsError } = await supabase
        .from('devis')
        .select('client_id, date_creation')
        .gte('date_creation', `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`)
        .lt('date_creation', `${currentYear}-${String(currentMonth + 2).padStart(2, '0')}-01`);

      if (clientsError) throw clientsError;

      // Clients uniques ce mois
      const clientsUniques = new Set(clientsData?.map((d : any) => d.client_id) || []);
      const clientsActifs = clientsUniques.size;

      // 3. Calcul des tendances (comparaison mois précédent)
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

      const { data: lastMonthData, error: lastMonthError } = await supabase
        .from('devis')
        .select('client_id, total_ttc, marge_globale_pourcent')
        .gte('date_creation', `${lastMonthYear}-${String(lastMonth + 1).padStart(2, '0')}-01`)
        .lt('date_creation', `${lastMonthYear}-${String(lastMonth + 2).padStart(2, '0')}-01`);

      if (lastMonthError) throw lastMonthError;

      // Calculs tendances
      const lastMonthClients = new Set(lastMonthData?.map((d : any) => d.client_id) || []).size;
      const lastMonthCA = lastMonthData?.reduce((sum : any, d: any) => sum + Number(d.total_ttc || 0), 0) || 0;
      const lastMonthMarge = lastMonthData?.length > 0 
        ? lastMonthData.reduce((sum : any, d: any) => sum + Number(d.marge_globale_pourcent || 0), 0) / lastMonthData.length 
        : 0;

      const trends = {
        devis: lastMonthData?.length > 0 ? ((devisStats.total - lastMonthData.length) / lastMonthData.length) * 100 : 0,
        chiffre: lastMonthCA > 0 ? ((devisStats.chiffreAffaireMensuel - lastMonthCA) / lastMonthCA) * 100 : 0,
        marge: lastMonthMarge > 0 ? ((devisStats.margeGlobaleMoyenne - lastMonthMarge) / lastMonthMarge) * 100 : 0,
        clients: lastMonthClients > 0 ? ((clientsActifs - lastMonthClients) / lastMonthClients) * 100 : 0
      };

      setStats({
        totalDevis: devisStats.total,
        chiffreAffaires: devisStats.chiffreAffaireMensuel,
        margeGlobale: devisStats.margeGlobaleMoyenne,
        clientsActifs,
        trends
      });

      console.log('✅ Dashboard stats chargées:', stats);

    } catch (err) {
      console.error('❌ Erreur chargement dashboard:', err);
      setError('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  // Charger au montage
  useEffect(() => {
    loadDashboardStats();
  }, []);

  // Formatage des valeurs
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR"
    }).format(value);

  if (error) {
    return (
      <div className="space-y-8">
        <HeroSection />
        <div className="p-6 rounded-xl bg-red-50 border border-red-200 text-center">
          <p className="text-red-700">{error}</p>
          <button 
            onClick={loadDashboardStats}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <HeroSection />
      
      {/* Grille des statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total des devis"
          value={loading ? "..." : stats.totalDevis}
          subtitle="Base de données"
          icon={FileText}
          trend={loading ? undefined : { 
            value: Number(stats.trends.devis.toFixed(1)), 
            isPositive: stats.trends.devis >= 0 
          }}
        />
        
        <StatsCard
          title="Chiffre d'affaires"
          value={loading ? "..." : formatCurrency(stats.chiffreAffaires)}
          subtitle="Ce mois (acceptés)"
          icon={DollarSign}
          trend={loading ? undefined : { 
            value: Number(stats.trends.chiffre.toFixed(1)), 
            isPositive: stats.trends.chiffre >= 0 
          }}
        />
        
        <StatsCard
          title="Marge globale"
          value={loading ? "..." : `${stats.margeGlobale.toFixed(1)}%`}
          subtitle="Moyenne générale"
          icon={TrendingUp}
          trend={loading ? undefined : { 
            value: Number(stats.trends.marge.toFixed(1)), 
            isPositive: stats.trends.marge >= 0 
          }}
        />
        
        <StatsCard
          title="Clients actifs"
          value={loading ? "..." : stats.clientsActifs}
          subtitle="Ce mois"
          icon={Users}
          trend={loading ? undefined : { 
            value: Number(stats.trends.clients.toFixed(1)), 
            isPositive: stats.trends.clients >= 0 
          }}
        />
      </div>
      
      {/* Section actions rapides */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
          Actions rapides
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-32 rounded-xl bg-white/5 border border-gray-200 backdrop-blur-md flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">
              {loading ? "Chargement..." : "Devis récents"}
            </p>
          </div>
          
          <div className="h-32 rounded-xl bg-white/5 border border-gray-200 backdrop-blur-md flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">
              {loading ? "Chargement..." : "Clients récents"}
            </p>
          </div>
          
          <div className="h-32 rounded-xl bg-white/5 border border-gray-200 backdrop-blur-md flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">
              {loading ? "Chargement..." : `${stats.totalDevis} devis total`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}