"use client";

import { cn } from "@/lib/utils/cn";
import { MargeAnalysis } from "@/lib/utils/margeUtils";
import { AlertTriangle, TrendingDown, Trophy, X } from "lucide-react";
import { useState } from "react";

interface AlerteMargeProps {
  alertes: MargeAnalysis['alertes'];
  onDismissAlert?: (index: number) => void;
  className?: string;
}

/**
 * Composant d'alertes de marge
 * Affichage contextuel des problèmes et succès
 */
export function AlerteMarge({ alertes, onDismissAlert, className }: AlerteMargeProps) {
  const [dismissedAlerts, setDismissedAlerts] = useState<number[]>([]);

  if (alertes.length === 0) return null;

  const handleDismiss = (index: number) => {
    setDismissedAlerts(prev => [...prev, index]);
    onDismissAlert?.(index);
  };

  const visibleAlertes = alertes.filter((_, index) => !dismissedAlerts.includes(index));

  if (visibleAlertes.length === 0) return null;

  const getAlertStyle = (type: MargeAnalysis['alertes'][0]['type']) => {
    switch (type) {
      case 'negative':
        return {
          container: "bg-red-500/10 border-red-500/20",
          text: "text-red-700 dark:text-red-300",
          icon: AlertTriangle,
          iconColor: "text-red-600"
        };
      case 'faible':
        return {
          container: "bg-yellow-500/10 border-yellow-500/20",
          text: "text-yellow-700 dark:text-yellow-300",
          icon: TrendingDown,
          iconColor: "text-yellow-600"
        };
      case 'excellente':
        return {
          container: "bg-green-500/10 border-green-500/20",
          text: "text-green-700 dark:text-green-300",
          icon: Trophy,
          iconColor: "text-green-600"
        };
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {visibleAlertes.map((alerte, index) => {
        const style = getAlertStyle(alerte.type);
        const Icon = style.icon;
        const originalIndex = alertes.indexOf(alerte);

        return (
          <div
            key={originalIndex}
            className={cn(
              "p-3 rounded-lg border transition-all duration-300",
              "backdrop-blur-sm",
              style.container
            )}
          >
            <div className="flex items-start space-x-3">
              <Icon className={cn("w-4 h-4 mt-0.5 flex-shrink-0", style.iconColor)} />
              
              <div className="flex-1 min-w-0">
                <p className={cn("text-sm font-medium", style.text)}>
                  {alerte.message}
                </p>
              </div>

              <button
                onClick={() => handleDismiss(originalIndex)}
                className={cn(
                  "p-1 rounded-full hover:bg-gray-100/20 transition-colors",
                  "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                )}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}