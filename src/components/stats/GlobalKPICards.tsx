"use client";

import { useState, useEffect } from "react";
import { 
  FileText, 
  Euro, 
  TrendingUp, 
  Target, 
  ShoppingCart, 
  Clock,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { StatsService, GlobalKPIData } from "@/lib/services/stats.service";

interface KPICardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  loading?: boolean;
}

/**
 * Carte KPI individuelle avec glassmorphism
 */
function KPICard({ title, value, icon: Icon, color, bgColor, loading }: KPICardProps) {
  return (
    <div className={cn(
      "p-6 rounded-xl border border-white/20",
      "bg-white/40 backdrop-blur-sm hover:bg-white/50",
      "transition-all duration-200 hover:shadow-lg"
    )}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-2">
            {title}
          </p>
          <div className="text-2xl font-bold text-gray-900">
            {loading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                <span className="text-gray-400">...</span>
              </div>
            ) : (
              value
            )}
          </div>
        </div>
        
        <div className={cn(
          "p-3 rounded-lg",
          bgColor
        )}>
          <Icon className={cn("w-6 h-6", color)} />
        </div>
      </div>
    </div>
  );
}

/**
 * Loading skeleton pour les cartes
 */
function KPICardSkeleton() {
  return (
    <div className={cn(
      "p-6 rounded-xl border border-white/20",
      "bg-white/40 backdrop-blur-sm animate-pulse"
    )}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="h-4 bg-gray-300/50 rounded mb-2 w-24"></div>
          <div className="h-8 bg-gray-300/50 rounded w-16"></div>
        </div>
        <div className="w-12 h-12 bg-gray-300/50 rounded-lg"></div>
      </div>
    </div>
  );
}

/**
 * Composant principal des 6 cartes KPI
 */
export function GlobalKPICards() {
  const [kpiData, setKpiData] = useState<GlobalKPIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadKPIData();
  }, []);

  const loadKPIData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await StatsService.getGlobalKPIs();
      setKpiData(data);
      
      console.log("✅ KPI chargés:", data);
    } catch (err) {
      console.error("❌ Erreur chargement KPI:", err);
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  // Configuration des cartes KPI
  const kpiCards = [
    {
      title: "Total Devis",
      value: kpiData ? kpiData.totalDevis.toString() : "0",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-500/20 border border-blue-500/30"
    },
    {
      title: "Chiffre d'Affaires",
      value: kpiData ? StatsService.formatEuros(kpiData.chiffreAffaires) : "0 €",
      icon: Euro,
      color: "text-green-600", 
      bgColor: "bg-green-500/20 border border-green-500/30"
    },
    {
      title: "Marge Moyenne",
      value: kpiData ? `${StatsService.formatEuros(kpiData.margeMoyenneEuros)} (${StatsService.formatPourcent(kpiData.margeMoyennePourcent)})` : "0 €",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-500/20 border border-purple-500/30"
    },
    {
      title: "Taux de Conversion", 
      value: kpiData ? StatsService.formatPourcent(kpiData.tauxConversion) : "0%",
      icon: Target,
      color: "text-orange-600",
      bgColor: "bg-orange-500/20 border border-orange-500/30"
    },
    {
      title: "Panier Moyen",
      value: kpiData ? StatsService.formatEuros(kpiData.panierMoyen) : "0 €",
      icon: ShoppingCart,
      color: "text-indigo-600",
      bgColor: "bg-indigo-500/20 border border-indigo-500/30"
    },
    {
      title: "Devis en Attente",
      value: kpiData ? kpiData.devisEnAttente.toString() : "0",
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-500/20 border border-amber-500/30"
    }
  ];

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="col-span-full p-6 rounded-xl border border-red-500/30 bg-red-500/10">
          <h3 className="font-medium text-red-700 mb-2">Erreur de chargement</h3>
          <p className="text-sm text-red-600">{error}</p>
          <button
            onClick={loadKPIData}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Indicateurs Clés
        </h2>
        <p className="text-gray-600">
          Vue d'ensemble des performances globales
        </p>
      </div>

      {/* Grille des cartes KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Squelettes de chargement
          Array.from({ length: 6 }).map((_, index) => (
            <KPICardSkeleton key={index} />
          ))
        ) : (
          // Cartes réelles
          kpiCards.map((card, index) => (
            <KPICard
              key={index}
              title={card.title}
              value={card.value}
              icon={card.icon}
              color={card.color}
              bgColor={card.bgColor}
            />
          ))
        )}
      </div>

      {/* Bouton refresh */}
      <div className="flex justify-end">
        <button
          onClick={loadKPIData}
          disabled={loading}
          className={cn(
            "flex items-center space-x-2 px-4 py-2 rounded-lg",
            "bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30",
            "text-blue-700 transition-colors text-sm",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <TrendingUp className="w-4 h-4" />
          <span>{loading ? "Actualisation..." : "Actualiser"}</span>
        </button>
      </div>
    </div>
  );
}