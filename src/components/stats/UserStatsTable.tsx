"use client";

import { useState, useEffect } from "react";
import { User, TrendingUp, Target, ShoppingCart, Loader2, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { StatsService, UserStatsData } from "@/lib/services/stats.service";

type SortField = 'utilisateur' | 'nbDevis' | 'chiffreAffaires' | 'margeMoyenne' | 'tauxConversion' | 'panierMoyen';
type SortDirection = 'asc' | 'desc';

/**
 * Tableau des statistiques par utilisateur
 */
export function UserStatsTable() {
  const [userData, setUserData] = useState<UserStatsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('chiffreAffaires');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await StatsService.getUserStats();
      setUserData(data);
      
      console.log("✅ Stats utilisateurs chargées:", data);
    } catch (err) {
      console.error("❌ Erreur chargement stats users:", err);
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedData = [...userData].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = (bValue as string).toLowerCase();
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    return (
      <ArrowUpDown className={cn(
        "w-4 h-4",
        sortDirection === 'desc' ? "text-blue-600 rotate-180" : "text-blue-600"
      )} />
    );
  };

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600 mb-3">{error}</p>
        <button
          onClick={loadUserData}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Chargement des statistiques utilisateurs...</span>
        </div>
      </div>
    );
  }

  if (userData.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Aucune donnée utilisateur disponible</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200/50">
            <th 
              className="text-left p-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-50/50 transition-colors"
              onClick={() => handleSort('utilisateur')}
            >
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Utilisateur</span>
                {getSortIcon('utilisateur')}
              </div>
            </th>
            <th 
              className="text-right p-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-50/50 transition-colors"
              onClick={() => handleSort('nbDevis')}
            >
              <div className="flex items-center justify-end space-x-2">
                <span>Nb Devis</span>
                {getSortIcon('nbDevis')}
              </div>
            </th>
            <th 
              className="text-right p-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-50/50 transition-colors"
              onClick={() => handleSort('chiffreAffaires')}
            >
              <div className="flex items-center justify-end space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>CA</span>
                {getSortIcon('chiffreAffaires')}
              </div>
            </th>
            <th 
              className="text-right p-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-50/50 transition-colors"
              onClick={() => handleSort('margeMoyenne')}
            >
              <div className="flex items-center justify-end space-x-2">
                <span>Marge Moy</span>
                {getSortIcon('margeMoyenne')}
              </div>
            </th>
            <th 
              className="text-right p-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-50/50 transition-colors"
              onClick={() => handleSort('tauxConversion')}
            >
              <div className="flex items-center justify-end space-x-2">
                <Target className="w-4 h-4" />
                <span>Taux Conv</span>
                {getSortIcon('tauxConversion')}
              </div>
            </th>
            <th 
              className="text-right p-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-50/50 transition-colors"
              onClick={() => handleSort('panierMoyen')}
            >
              <div className="flex items-center justify-end space-x-2">
                <ShoppingCart className="w-4 h-4" />
                <span>Panier Moy</span>
                {getSortIcon('panierMoyen')}
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((user, index) => (
            <tr 
              key={index}
              className={cn(
                "border-b border-gray-100/50 hover:bg-gray-50/30 transition-colors",
                index % 2 === 0 && "bg-gray-25/30"
              )}
            >
              <td className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    "bg-gradient-to-br from-blue-500/20 to-purple-500/20",
                    "border border-blue-500/30"
                  )}>
                    <span className="text-sm font-semibold text-blue-600">
                      {user.utilisateur.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {user.utilisateur}
                  </span>
                </div>
              </td>
              <td className="p-4 text-right">
                <span className="text-gray-900 font-medium">
                  {user.nbDevis}
                </span>
              </td>
              <td className="p-4 text-right">
                <span className="text-gray-900 font-medium">
                  {StatsService.formatEuros(user.chiffreAffaires)}
                </span>
              </td>
              <td className="p-4 text-right">
                <span className="text-gray-900 font-medium">
                  {StatsService.formatEuros(user.margeMoyenne)}
                </span>
              </td>
              <td className="p-4 text-right">
                <span className={cn(
                  "font-medium",
                  user.tauxConversion >= 50 ? "text-green-600" : 
                  user.tauxConversion >= 30 ? "text-orange-600" : "text-red-600"
                )}>
                  {StatsService.formatPourcent(user.tauxConversion)}
                </span>
              </td>
              <td className="p-4 text-right">
                <span className="text-gray-900 font-medium">
                  {StatsService.formatEuros(user.panierMoyen)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Résumé */}
      <div className="p-4 border-t border-gray-200/50 bg-gray-50/30">
        <p className="text-sm text-gray-600 text-center">
          {userData.length} utilisateur{userData.length > 1 ? 's' : ''} • 
          Total CA: {StatsService.formatEuros(userData.reduce((sum, u) => sum + u.chiffreAffaires, 0))}
        </p>
      </div>
    </div>
  );
}