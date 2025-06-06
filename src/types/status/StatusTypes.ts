/**
 * TYPES ÉTENDUS POUR GESTION DES STATUTS
 * Extension des types existants avec nouvelles fonctionnalités
 */

import { DevisStatus } from "@/types";

// Extension de l'interface Devis existante pour inclure les nouveaux champs
export interface DevisWithStatus {
  id: string;
  numero: string;
  date: Date;
  dateValidite: Date;
  clientId: string;
  clientNom?: string;
  status: DevisStatus;
  totalHT: number;
  totalTTC: number;
  margeGlobale: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  // NOUVEAUX CHAMPS
  lastStatusChange?: Date;
  statusChangesCount?: number;
  isExpired?: boolean;
  daysUntilExpiry?: number;
  canModify?: boolean;
}

// Historique des changements de statut
export interface StatusChangeHistory {
  id: string;
  devisId: string;
  previousStatus: DevisStatus;
  newStatus: DevisStatus;
  changedAt: Date;
  changedBy?: string;
  note?: string;
  duration?: number; // Durée dans ce statut en jours
}

// Statistiques avancées des statuts
export interface StatusStatistics {
  total: number;
  byStatus: Record<DevisStatus, number>;
  percentages: Record<DevisStatus, number>;
  trends: {
    thisMonth: Record<DevisStatus, number>;
    lastMonth: Record<DevisStatus, number>;
    growth: Record<DevisStatus, number>;
  };
  averageDuration: {
    brouillonToEnvoye: number;
    envoyeToAccepte: number;
    envoyeToRefuse: number;
    overall: number;
  };
  conversionRates: {
    envoyeToAccepte: number;
    envoyeToRefuse: number;
    acceptanceRate: number;
  };
  expiredCount: number;
  chiffreAffaires: {
    accepte: number;
    refuse: number;
    enAttente: number;
  };
}

// Configuration des actions selon le statut
export interface StatusActionConfig {
  status: DevisStatus;
  label: string;
  description: string;
  color: 'blue' | 'green' | 'red' | 'orange' | 'gray' | 'purple';
  icon: string;
  allowsModification: boolean;
  isFinal: boolean;
  requiresNote: boolean;
}

// Notification de changement de statut
export interface StatusNotification {
  id: string;
  devisId: string;
  devisNumero: string;
  clientNom: string;
  previousStatus: DevisStatus;
  newStatus: DevisStatus;
  changedAt: Date;
  message: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

// Filtre avancé pour les devis
export interface AdvancedDevisFilter {
  status?: DevisStatus[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  clientIds?: string[];
  amountRange?: {
    min: number;
    max: number;
  };
  margeRange?: {
    min: number;
    max: number;
  };
  isExpired?: boolean;
  hasNotes?: boolean;
  sortBy?: 'date' | 'amount' | 'client' | 'status' | 'expiry';
  sortDirection?: 'asc' | 'desc';
}

// Rapport de performance des statuts
export interface StatusPerformanceReport {
  period: {
    start: Date;
    end: Date;
  };
  summary: StatusStatistics;
  topClients: Array<{
    clientId: string;
    clientNom: string;
    devisCount: number;
    acceptanceRate: number;
    chiffreAffaires: number;
  }>;
  slowestDevis: Array<{
    devisId: string;
    numero: string;
    daysInStatus: number;
    currentStatus: DevisStatus;
  }>;
  alerts: Array<{
    type: 'expiring_soon' | 'long_pending' | 'high_value_refused';
    devisId: string;
    message: string;
    severity: 'info' | 'warning' | 'error';
  }>;
}

// Configuration des transitions de statut
export const STATUS_TRANSITIONS: Record<DevisStatus, DevisStatus[]> = {
  brouillon: ['envoye'],
  envoye: ['accepte', 'refuse', 'brouillon', 'expire'],
  accepte: ['brouillon'], // Réouvrir pour modification
  refuse: ['brouillon', 'envoye'], // Réouvrir ou renvoyer modifié
  expire: ['brouillon', 'envoye'] // Réactiver
};

// Configuration des couleurs et styles par statut
export const STATUS_CONFIG: Record<DevisStatus, StatusActionConfig> = {
  brouillon: {
    status: 'brouillon',
    label: 'Brouillon',
    description: 'En cours de rédaction',
    color: 'gray',
    icon: 'FileText',
    allowsModification: true,
    isFinal: false,
    requiresNote: false
  },
  envoye: {
    status: 'envoye',
    label: 'Envoyé',
    description: 'Transmis au client en attente de réponse',
    color: 'blue',
    icon: 'Send',
    allowsModification: false,
    isFinal: false,
    requiresNote: false
  },
  accepte: {
    status: 'accepte',
    label: 'Accepté',
    description: 'Validé et accepté par le client',
    color: 'green',
    icon: 'CheckCircle',
    allowsModification: false,
    isFinal: true,
    requiresNote: false
  },
  refuse: {
    status: 'refuse',
    label: 'Refusé',
    description: 'Rejeté par le client',
    color: 'red',
    icon: 'XCircle',
    allowsModification: false,
    isFinal: true,
    requiresNote: true
  },
  expire: {
    status: 'expire',
    label: 'Expiré',
    description: 'Date de validité dépassée',
    color: 'orange',
    icon: 'Clock',
    allowsModification: false,
    isFinal: false,
    requiresNote: false
  }
};

// Utilitaires pour calculs de statuts
export class StatusUtils {
  
  // Vérifier si un devis est expiré
  static isExpired(dateValidite: Date, currentStatus: DevisStatus): boolean {
    return new Date() > dateValidite && currentStatus === 'envoye';
  }

  // Calculer les jours jusqu'à expiration
  static getDaysUntilExpiry(dateValidite: Date): number {
    const now = new Date();
    const diff = dateValidite.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  // Obtenir le statut effectif (avec gestion expiration)
  static getEffectiveStatus(status: DevisStatus, dateValidite: Date): DevisStatus {
    if (this.isExpired(dateValidite, status)) {
      return 'expire';
    }
    return status;
  }

  // Calculer la durée moyenne dans un statut
  static calculateAverageDuration(changes: StatusChangeHistory[]): number {
    if (changes.length < 2) return 0;
    
    const durations = changes.map(change => change.duration || 0).filter(d => d > 0);
    return durations.length > 0 ? durations.reduce((sum, d) => sum + d, 0) / durations.length : 0;
  }

  // Générer des alertes selon les statuts
  static generateStatusAlerts(devis: DevisWithStatus[]): StatusNotification[] {
    const alerts: StatusNotification[] = [];
    
    devis.forEach(d => {
      // Devis expirant bientôt
      if (d.status === 'envoye' && d.daysUntilExpiry && d.daysUntilExpiry <= 3 && d.daysUntilExpiry > 0) {
        alerts.push({
          id: `expiring_${d.id}`,
          devisId: d.id,
          devisNumero: d.numero,
          clientNom: d.clientNom || '',
          previousStatus: d.status,
          newStatus: d.status,
          changedAt: new Date(),
          message: `Le devis ${d.numero} expire dans ${d.daysUntilExpiry} jour(s)`,
          read: false,
          priority: 'high'
        });
      }
      
      // Devis en attente depuis longtemps
      if (d.status === 'envoye' && d.lastStatusChange) {
        const daysSinceChange = Math.floor((new Date().getTime() - d.lastStatusChange.getTime()) / (1000 * 60 * 60 * 24));
        if (daysSinceChange > 7) {
          alerts.push({
            id: `pending_${d.id}`,
            devisId: d.id,
            devisNumero: d.numero,
            clientNom: d.clientNom || '',
            previousStatus: d.status,
            newStatus: d.status,
            changedAt: new Date(),
            message: `Le devis ${d.numero} est en attente depuis ${daysSinceChange} jours`,
            read: false,
            priority: 'medium'
          });
        }
      }
    });
    
    return alerts;
  }
}