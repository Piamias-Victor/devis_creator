"use client";

import { StatsCard } from "./StatsCard";
import { HeroSection } from "./HeroSection";
import { MOCK_DASHBOARD_STATS } from "@/data/mockData";
import { 
  FileText, 
  TrendingUp, 
  DollarSign, 
  Users 
} from "lucide-react";

/**
 * Page tableau de bord principale
 * Vue d'ensemble métiers + statistiques
 */
export function Dashboard() {
  const stats = MOCK_DASHBOARD_STATS;

  // Formatage des valeurs pour affichage
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR"
    }).format(value);

  return (
    <div className="space-y-8">
      <HeroSection />
      
      {/* Grille des statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total des devis"
          value={stats.totalDevis}
          subtitle="Ce mois"
          icon={FileText}
          trend={{ value: 12.5, isPositive: true }}
        />
        
        <StatsCard
          title="Chiffre d'affaires"
          value={formatCurrency(stats.chiffreAffaires)}
          subtitle="Mensuel"
          icon={DollarSign}
          trend={{ value: 8.2, isPositive: true }}
        />
        
        <StatsCard
          title="Marge globale"
          value={`${stats.margeGlobale}%`}
          subtitle="Moyenne"
          icon={TrendingUp}
          trend={{ value: -2.1, isPositive: false }}
        />
        
        <StatsCard
          title="Clients actifs"
          value={stats.clientsActifs}
          subtitle="Ce trimestre"
          icon={Users}
          trend={{ value: 15.8, isPositive: true }}
        />
      </div>
      
      {/* Section actions rapides */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
          Actions rapides
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Placeholder pour futures fonctionnalités */}
          <div className="h-32 rounded-xl bg-white/5 border border-gray100 backdrop-blur-md flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Devis récents</p>
          </div>
          
          <div className="h-32 rounded-xl bg-white/5 border border-gray100 backdrop-blur-md flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Clients récents</p>
          </div>
          
          <div className="h-32 rounded-xl bg-white/5 border border-gray100 backdrop-blur-md flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Statistiques</p>
          </div>
        </div>
      </div>
    </div>
  );
}