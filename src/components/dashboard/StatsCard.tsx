"use client";

import { cn } from "@/lib/utils/cn";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

/**
 * Carte de statistique avec glassmorphism
 * Affichage métrique + tendance + icône
 */
export function StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon,
  trend,
  className 
}: StatsCardProps) {
  return (
    <div className={cn(
      "p-6 rounded-xl transition-all duration-300",
      "bg-gray-100 backdrop-blur-md border border-gray-200",
      "hover:bg-white/15 hover:border-white/30 hover:shadow-xl",
      "hover:shadow-blue-500/10 hover:-translate-y-1",
      "supports-[backdrop-filter]:bg-gray-100",
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-500">
              {subtitle}
            </p>
          )}
        </div>
        
        <div className={cn(
          "p-3 rounded-lg",
          "bg-gradient-to-br from-blue-500/20 to-purple-600/20",
          "border border-gray-200"
        )}>
          <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
      
      {trend && (
        <div className="mt-4 pt-4 border-t border-gray100">
          <span className={cn(
            "text-sm font-medium",
            trend.isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
          )}>
            {trend.isPositive ? "+" : ""}{trend.value}%
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-500 ml-2">
            vs mois dernier
          </span>
        </div>
      )}
    </div>
  );
}