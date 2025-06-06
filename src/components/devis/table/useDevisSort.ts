"use client";

import { useState, useMemo } from "react";
import { DevisLine } from "@/types";

export type DevisSortField = 'designation' | 'quantite' | 'prixUnitaire' | 'margePourcent' | 'totalTTC';
export type SortDirection = 'asc' | 'desc';

interface UseDevisSortReturn {
  sortedLignes: DevisLine[];
  sortField: DevisSortField;
  sortDirection: SortDirection;
  setSortField: (field: DevisSortField) => void;
  toggleSort: (field: DevisSortField) => void;
  resetSort: () => void;
}

/**
 * Hook pour trier les lignes de devis
 * Tri par désignation, quantité, prix ou marge
 */
export function useDevisSort(lignes: DevisLine[]): UseDevisSortReturn {
  const [sortField, setSortField] = useState<DevisSortField>('designation');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Fonction de tri avec types stricts
  const sortedLignes = useMemo(() => {
    if (!lignes || lignes.length === 0) return [];

    const sorted = [...lignes].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'designation':
          aValue = a.designation.toLowerCase();
          bValue = b.designation.toLowerCase();
          break;
        case 'quantite':
          aValue = a.quantite;
          bValue = b.quantite;
          break;
        case 'prixUnitaire':
          aValue = a.prixUnitaire;
          bValue = b.prixUnitaire;
          break;
        case 'margePourcent':
          aValue = a.margePourcent || 0;
          bValue = b.margePourcent || 0;
          break;
        case 'totalTTC':
          aValue = a.totalTTC || 0;
          bValue = b.totalTTC || 0;
          break;
        default:
          return 0;
      }

      // Tri numérique ou alphabétique
      let comparison = 0;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue, 'fr', { numeric: true });
      } else {
        comparison = (aValue as number) - (bValue as number);
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [lignes, sortField, sortDirection]);

  // Basculer le tri sur un champ
  const toggleSort = (field: DevisSortField) => {
    if (sortField === field) {
      // Même champ : inverser la direction
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      // Nouveau champ : commencer par ascendant
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Réinitialiser le tri
  const resetSort = () => {
    setSortField('designation');
    setSortDirection('asc');
  };

  return {
    sortedLignes,
    sortField,
    sortDirection,
    setSortField,
    toggleSort,
    resetSort
  };
}