"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { StatsService, ClientData } from "@/lib/services/stats.service";

/**
 * Composant Tooltip personnalisé pour le graphique barres
 */
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className={cn(
        "p-4 rounded-lg border border-white/20",
        "bg-white backdrop-blur-lg shadow-xl"
      )}>
        <p className="font-medium text-gray-900 mb-2">
          {label}
        </p>
        <div className="space-y-1">
          <p className="text-sm text-gray-600">
            <span className="font-medium">CA:</span> {StatsService.formatEuros(data.chiffreAffaires)}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Devis:</span> {data.nbDevis}
          </p>
        </div>
      </div>
    );
  }
  return null;
}

/**
 * Graphique barres du top 5 clients par CA
 */
export function TopClientsChart() {
  const [clientsData, setClientsData] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadClientsData();
  }, []);

  const loadClientsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await StatsService.getTopClients();
      setClientsData(data);
      
      console.log("✅ Top clients chargés:", data);
    } catch (err) {
      console.error("❌ Erreur chargement clients:", err);
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
          onClick={loadClientsData}
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
          <Loader2 className="w-6 h-6 animate-spin text-green-600" />
          <span className="text-gray-600">Chargement des clients...</span>
        </div>
      </div>
    );
  }

  if (clientsData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <p className="text-gray-500">Aucun client avec CA disponible</p>
      </div>
    );
  }

  // Formatter les données pour le graphique
  const chartData = clientsData.map(client => ({
    ...client,
    // Tronquer les noms trop longs pour l'affichage
    nomCourt: client.nom.length > 15 ? client.nom.substring(0, 15) + '...' : client.nom
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="nomCourt"
            angle={-45}
            textAnchor="end"
            height={60}
            fontSize={12}
            stroke="#6b7280"
          />
          <YAxis 
            tickFormatter={(value) => StatsService.formatEuros(value)}
            fontSize={12}
            stroke="#6b7280"
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="chiffreAffaires" 
            fill="#10b981"
            radius={[4, 4, 0, 0]}
            stroke="#059669"
            strokeWidth={1}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}