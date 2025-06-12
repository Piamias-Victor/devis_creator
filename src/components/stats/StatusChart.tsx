"use client";

import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { StatsService, StatusData } from "@/lib/services/stats.service";

/**
 * Composant Tooltip personnalisé pour le graphique donut
 */
function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className={cn(
        "p-3 rounded-lg border border-white/20",
        "bg-white backdrop-blur-lg shadow-xl"
      )}>
        <p className="font-medium text-gray-900">
          {data.status}
        </p>
        <p className="text-sm text-gray-600">
          {data.count} devis ({data.percentage.toFixed(1)}%)
        </p>
      </div>
    );
  }
  return null;
}

/**
 * Composant Légende personnalisée
 */
function CustomLegend({ payload }: any) {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center space-x-2">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-gray-700">
            {entry.value} ({entry.payload.count})
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * Graphique donut des statuts de devis
 */
export function StatusChart() {
  const [statusData, setStatusData] = useState<StatusData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStatusData();
  }, []);

  const loadStatusData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await StatsService.getStatusDistribution();
      setStatusData(data);
      
      console.log("✅ Données statuts chargées:", data);
    } catch (err) {
      console.error("❌ Erreur chargement statuts:", err);
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-center">
        <p className="text-red-600 mb-3">{error}</p>
        <button
          onClick={loadStatusData}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Chargement des statuts...</span>
        </div>
      </div>
    );
  }

  if (statusData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <p className="text-gray-500">Aucune donnée disponible</p>
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={statusData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="count"
          >
            {statusData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color}
                stroke="white"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}