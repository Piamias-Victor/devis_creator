"use client";

import { BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { GlobalKPICards } from "./GlobalKPICards";
import { StatusChart } from "./StatusChart";
import { TopClientsChart } from "./TopClientsChart";
import { UserStatsTable } from "./UserStatsTable";

/**
 * Page principale des statistiques 
 * Accessible uniquement aux admins
 */
export function StatsPage() {
  return (
    <div className="space-y-8">
      {/* En-tête de la page */}
      <div className={cn(
        "p-6 rounded-xl border border-white/20",
        "bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm"
      )}>
        <div className="flex items-center space-x-3">
          <div className={cn(
            "p-3 rounded-lg",
            "bg-gradient-to-br from-blue-500/20 to-purple-500/20",
            "border border-blue-500/30 backdrop-blur-sm"
          )}>
            <BarChart3 className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Statistiques
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Analyse des performances et indicateurs clés
            </p>
          </div>
        </div>
      </div>

      {/* Section KPI Globaux */}
      <GlobalKPICards />

      {/* Section Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Graphique répartition statuts */}
        <div className={cn(
          "p-6 rounded-xl border border-white/20",
          "bg-white/40 backdrop-blur-sm"
        )}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Répartition des Statuts
          </h3>
          <StatusChart />
        </div>

        {/* Graphique top clients */}
        <div className={cn(
          "p-6 rounded-xl border border-white/20", 
          "bg-white/40 backdrop-blur-sm"
        )}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top 5 Clients par CA
          </h3>
          <TopClientsChart />
        </div>
      </div>

      {/* Section Tableau Utilisateurs */}
      <div className={cn(
        "rounded-xl border border-white/20",
        "bg-white/40 backdrop-blur-sm"
      )}>
        <div className="p-6 border-b border-gray-200/50">
          <h3 className="text-lg font-semibold text-gray-900">
            Statistiques par Utilisateur
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Performance individuelle des créateurs de devis
          </p>
        </div>
        <UserStatsTable />
      </div>
    </div>
  );
}