"use client";

import { cn } from "@/lib/utils/cn";
import { DevisSortField, SortDirection } from "./useDevisSort";
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  X,
  Package,
  Hash,
  Euro,
  TrendingUp
} from "lucide-react";

interface SortControlsProps {
  sortField: DevisSortField;
  sortDirection: SortDirection;
  onToggleSort: (field: DevisSortField) => void;
  onResetSort: () => void;
  lignesCount: number;
  className?: string;
}

/**
 * Contrôles de tri pour les lignes de devis
 * Boutons rapides + indicateurs visuels
 */
export function SortControls({
  sortField,
  sortDirection,
  onToggleSort,
  onResetSort,
  lignesCount,
  className
}: SortControlsProps) {

  // Configuration des boutons de tri
  const sortOptions = [
    {
      field: 'designation' as DevisSortField,
      label: 'Alphabétique',
      icon: Package,
      color: 'blue'
    },
    {
      field: 'quantite' as DevisSortField,
      label: 'Quantité',
      icon: Hash,
      color: 'green'
    },
    {
      field: 'prixUnitaire' as DevisSortField,
      label: 'Prix unitaire',
      icon: Euro,
      color: 'purple'
    },
    {
      field: 'margePourcent' as DevisSortField,
      label: 'Marge %',
      icon: TrendingUp,
      color: 'orange'
    }
  ];

  // Style des boutons selon l'état
  const getButtonStyle = (field: DevisSortField, color: string) => {
    const isActive = sortField === field;
    
    const colorClasses = {
      blue: isActive 
        ? "bg-blue-500/20 border-blue-500/30 text-blue-700 dark:text-blue-300" 
        : "hover:bg-blue-500/10 border-gray-200 text-gray-700 dark:text-gray-300",
      green: isActive 
        ? "bg-green-500/20 border-green-500/30 text-green-700 dark:text-green-300" 
        : "hover:bg-green-500/10 border-gray-200 text-gray-700 dark:text-gray-300",
      purple: isActive 
        ? "bg-purple-500/20 border-purple-500/30 text-purple-700 dark:text-purple-300" 
        : "hover:bg-purple-500/10 border-gray-200 text-gray-700 dark:text-gray-300",
      orange: isActive 
        ? "bg-orange-500/20 border-orange-500/30 text-orange-700 dark:text-orange-300" 
        : "hover:bg-orange-500/10 border-gray-200 text-gray-700 dark:text-gray-300"
    };

    return cn(
      "flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-200",
      "backdrop-blur-sm text-sm font-medium",
      "hover:-translate-y-0.5 hover:shadow-lg",
      colorClasses[color as keyof typeof colorClasses]
    );
  };

  // Icône de direction de tri
  const getSortIcon = (field: DevisSortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 opacity-50" />;
    }
    
    return sortDirection === 'asc' 
      ? <ArrowUp className="w-4 h-4" />
      : <ArrowDown className="w-4 h-4" />;
  };

  if (lignesCount === 0) {
    return null; // Pas de contrôles si pas de lignes
  }

  return (
    <div className={cn(
      "p-4 rounded-xl border border-gray-200",
      "bg-white/5 backdrop-blur-md",
      "supports-[backdrop-filter]:bg-white/5",
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Trier par :
          </h4>
          
          <div className="flex items-center space-x-2">
            {sortOptions.map((option) => {
              const Icon = option.icon;
              
              return (
                <button
                  key={option.field}
                  onClick={() => onToggleSort(option.field)}
                  className={getButtonStyle(option.field, option.color)}
                  title={`Trier par ${option.label}`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{option.label}</span>
                  {getSortIcon(option.field)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Reset et info */}
        <div className="flex items-center space-x-3">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {lignesCount} produit{lignesCount > 1 ? 's' : ''} • 
            Trié par {sortOptions.find(o => o.field === sortField)?.label.toLowerCase()} 
            ({sortDirection === 'asc' ? 'croissant' : 'décroissant'})
          </span>
          
          <button
            onClick={onResetSort}
            className={cn(
              "p-2 rounded-lg transition-all duration-200",
              "hover:bg-gray-500/20 text-gray-500 hover:text-gray-700",
              "dark:hover:text-gray-300"
            )}
            title="Réinitialiser le tri"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}