"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils/cn";
import { StatusStatistics, StatusNotification, StatusUtils } from "@/types/status/StatusTypes";
import { StatusBadge } from "./StatusBadge";
import { DevisRepository } from "@/lib/repositories/devisRepository";
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Send,
  FileText,
  Bell,
  Calendar,
  DollarSign,
  Percent
} from "lucide-react";

interface StatusDashboardProps {
  className?: string;
  compact?: boolean;
}

/**
 * Dashboard complet des statuts avec statistiques et alertes
 * Vue d'ensemble des performances et tendances
 */
export function StatusDashboard({ className, compact = false }: StatusDashboardProps) {
  const [stats, setStats] = useState<StatusStatistics | null>(null);
  const [alerts, setAlerts] = useState<StatusNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les statistiques
  const loadStatusStatistics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Ici vous devriez implémenter la logique pour récupérer les stats depuis Supabase
      // Pour l'exemple, simulation de données
      const mockStats: StatusStatistics = {
        total: 45,
        byStatus: {
          brouillon: 12,
          envoye: 18,
          accepte: 10,
          refuse: 3,
          expire: 2
        },
        percentages: {
          brouillon: 26.7,
          envoye: 40.0,
          accepte: 22.2,
          refuse: 6.7,
          expire: 4.4
        },
        trends: {
          thisMonth: { brouillon: 12, envoye: 18, accepte: 10, refuse: 3, expire: 2 },
          lastMonth: { brouillon: 15, envoye: 16, accepte: 8, refuse: 4, expire: 1 },
          growth: { brouillon: -20, envoye: 12.5, accepte: 25, refuse: -25, expire: 100 }
        },
        averageDuration: {
          brouillonToEnvoye: 2.5,
          envoyeToAccepte: 5.2,
          envoyeToRefuse: 3.8,
          overall: 4.1
        },
        conversionRates: {
          envoyeToAccepte: 55.6,
          envoyeToRefuse: 16.7,
          acceptanceRate: 71.4
        },
        expiredCount: 2,
        chiffreAffaires: {
          accepte: 125000,
          refuse: 35000,
          enAttente: 95000
        }
      };

      setStats(mockStats);

      // Générer des alertes simulées
      const mockAlerts: StatusNotification[] = [
        {
          id: '1',
          devisId: 'devis1',
          devisNumero: 'DEV2025-001',
          clientNom: 'EHPAD Les Roses',
          previousStatus: 'envoye',
          newStatus: 'envoye',
          changedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          message: 'Devis en attente depuis 2 jours - relance recommandée',
          read: false,
          priority: 'medium'
        },
        {
          id: '2',
          devisId: 'devis2',
          devisNumero: 'DEV2025-002',
          clientNom: 'Résidence Soleil',
          previousStatus: 'envoye',
          newStatus: 'expire',
          changedAt: new Date(),
          message: 'Devis expiré aujourd\'hui - renouvellement nécessaire',
          read: false,
          priority: 'high'
        }
      ];

      setAlerts(mockAlerts);

    } catch (err) {
      setError('Erreur lors du chargement des statistiques');
      console.error('Erreur stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatusStatistics();
  }, []);

  if (loading) {
    return (
      <div className={cn(
        "rounded-xl border border-gray-200 bg-white/5 backdrop-blur-md",
        "p-8 text-center animate-pulse",
        className
      )}>
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className={cn(
        "rounded-xl border border-red-200 bg-red-50/50 backdrop-blur-md",
        "p-6 text-center",
        className
      )}>
        <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-3" />
        <p className="text-red-700">{error || 'Données non disponibles'}</p>
        <button 
          onClick={loadStatusStatistics}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Réessayer
        </button>
      </div>
    );
  }

  // Fonction pour obtenir l'icône selon le statut
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'brouillon': return FileText;
      case 'envoye': return Send;
      case 'accepte': return CheckCircle;
      case 'refuse': return XCircle;
      case 'expire': return Clock;
      default: return FileText;
    }
  };

  // Formatage des montants
  const formatAmount = (amount: number) => 
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

  return (
    <div className={cn(
      "space-y-6",
      className
    )}>
      {/* Header avec titre */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Tableau de bord des statuts
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Vue d'ensemble des performances et tendances
          </p>
        </div>

        {/* Alertes rapides */}
        {alerts.length > 0 && (
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-medium text-orange-600">
              {alerts.length} alerte{alerts.length > 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(stats.byStatus).map(([status, count]) => {
          const Icon = getStatusIcon(status);
          const percentage = stats.percentages[status as keyof typeof stats.percentages];
          const growth = stats.trends.growth[status as keyof typeof stats.trends.growth];
          
          return (
            <div
              key={status}
              className={cn(
                "p-4 rounded-xl border border-gray-200 transition-all duration-200",
                "bg-white/5 backdrop-blur-md hover:shadow-lg hover:-translate-y-1"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className="w-5 h-5 text-gray-600" />
                <StatusBadge status={status as any} size="sm" showIcon={false} />
              </div>
              
              <div className="space-y-1">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {count}
                </div>
                <div className="text-xs text-gray-500">
                  {percentage.toFixed(1)}% du total
                </div>
                
                {/* Tendance */}
                <div className="flex items-center space-x-1 text-xs">
                  {growth > 0 ? (
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  ) : growth < 0 ? (
                    <TrendingDown className="w-3 h-3 text-red-500" />
                  ) : null}
                  <span className={cn(
                    "font-medium",
                    growth > 0 ? "text-green-600" : growth < 0 ? "text-red-600" : "text-gray-500"
                  )}>
                    {growth > 0 ? '+' : ''}{growth.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Métriques de performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Taux de conversion */}
        <div className={cn(
          "p-6 rounded-xl border border-gray-200",
          "bg-green-50/50 backdrop-blur-md"
        )}>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 rounded-lg bg-green-500/20">
              <Percent className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Taux d'acceptation</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Acceptés</span>
              <span className="font-bold text-green-600">
                {stats.conversionRates.envoyeToAccepte.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Refusés</span>
              <span className="font-bold text-red-600">
                {stats.conversionRates.envoyeToRefuse.toFixed(1)}%
              </span>
            </div>
            <div className="pt-2 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Taux global</span>
                <span className="text-xl font-bold text-green-600">
                  {stats.conversionRates.acceptanceRate.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Durées moyennes */}
        <div className={cn(
          "p-6 rounded-xl border border-gray-200",
          "bg-blue-50/50 backdrop-blur-md"
        )}>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Durées moyennes</h3>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Brouillon → Envoyé</span>
              <span className="font-medium">{stats.averageDuration.brouillonToEnvoye.toFixed(1)}j</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Envoyé → Accepté</span>
              <span className="font-medium">{stats.averageDuration.envoyeToAccepte.toFixed(1)}j</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Envoyé → Refusé</span>
              <span className="font-medium">{stats.averageDuration.envoyeToRefuse.toFixed(1)}j</span>
            </div>
            <div className="pt-2 border-t border-gray-200">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Durée globale</span>
                <span className="text-lg font-bold text-blue-600">
                  {stats.averageDuration.overall.toFixed(1)}j
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Chiffre d'affaires */}
        <div className={cn(
          "p-6 rounded-xl border border-gray-200",
          "bg-purple-50/50 backdrop-blur-md"
        )}>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Chiffre d'affaires</h3>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Accepté</span>
              <span className="font-medium text-green-600">
                {formatAmount(stats.chiffreAffaires.accepte)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">En attente</span>
              <span className="font-medium text-blue-600">
                {formatAmount(stats.chiffreAffaires.enAttente)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Refusé</span>
              <span className="font-medium text-red-600">
                {formatAmount(stats.chiffreAffaires.refuse)}
              </span>
            </div>
            <div className="pt-2 border-t border-gray-200">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Potentiel total</span>
                <span className="text-lg font-bold text-purple-600">
                  {formatAmount(
                    stats.chiffreAffaires.accepte + 
                    stats.chiffreAffaires.enAttente + 
                    stats.chiffreAffaires.refuse
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alertes et notifications */}
      {alerts.length > 0 && (
        <div className={cn(
          "p-6 rounded-xl border border-orange-200",
          "bg-orange-50/50 backdrop-blur-md"
        )}>
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 rounded-lg bg-orange-500/20">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900">
              Alertes et notifications ({alerts.length})
            </h3>
          </div>
          
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  "p-4 rounded-lg border transition-all duration-200",
                  "bg-white/50 hover:bg-white/80",
                  alert.priority === 'high' ? "border-red-300 bg-red-50/50" :
                  alert.priority === 'medium' ? "border-orange-300 bg-orange-50/50" :
                  "border-gray-200"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900">
                        {alert.devisNumero}
                      </span>
                      <span className="text-sm text-gray-600">
                        • {alert.clientNom}
                      </span>
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium",
                        alert.priority === 'high' ? "bg-red-100 text-red-700" :
                        alert.priority === 'medium' ? "bg-orange-100 text-orange-700" :
                        "bg-gray-100 text-gray-700"
                      )}>
                        {alert.priority === 'high' ? 'Urgent' :
                         alert.priority === 'medium' ? 'Important' : 'Info'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {alert.changedAt.toLocaleDateString('fr-FR')} à{' '}
                      {alert.changedAt.toLocaleTimeString('fr-FR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer avec résumé */}
      <div className={cn(
        "p-4 rounded-lg border border-gray-200",
        "bg-gray-50/50 backdrop-blur-sm text-center"
      )}>
        <p className="text-sm text-gray-600">
          📊 Total: <strong>{stats.total} devis</strong> • 
          🕐 Durée moyenne: <strong>{stats.averageDuration.overall.toFixed(1)} jours</strong> • 
          ✅ Taux d'acceptation: <strong>{stats.conversionRates.acceptanceRate.toFixed(1)}%</strong>
          {stats.expiredCount > 0 && (
            <> • ⚠️ <strong>{stats.expiredCount} expiré{stats.expiredCount > 1 ? 's' : ''}</strong></>
          )}
        </p>
      </div>
    </div>
  );
}