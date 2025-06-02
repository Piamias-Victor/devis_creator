"use client";

import { cn } from "@/lib/utils/cn";
import { Plus, FileText, List } from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * Section hero du dashboard
 * MODIFIÉE - Ajout bouton "Voir les devis"
 */
export function HeroSection() {
  const router = useRouter();

  return (
    <div className={cn(
      "mb-8 p-8 rounded-2xl",
      "bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10",
      "border border-gray-200 backdrop-blur-md",
      "supports-[backdrop-filter]:bg-white/5"
    )}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Tableau de bord
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Gérez vos devis et clients en toute simplicité
          </p>
          
          {/* Actions rapides MODIFIÉES */}
          <div className="flex space-x-4">
            <button 
              onClick={() => router.push("/devis/new")}
              className={cn(
                "flex items-center space-x-2 px-6 py-3 rounded-lg",
                "bg-blue-600 hover:bg-blue-700 text-white",
                "transition-all duration-200 font-medium",
                "shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30",
                "hover:-translate-y-0.5"
              )}
            >
              <Plus className="w-5 h-5" />
              <span>Nouveau devis</span>
            </button>
            
            {/* NOUVEAU BOUTON */}
            <button 
              onClick={() => router.push("/devis")}
              className={cn(
                "flex items-center space-x-2 px-6 py-3 rounded-lg",
                "bg-gray-200 hover:bg-gray-300 border border-white/30",
                "backdrop-blur-sm text-gray-700 dark:text-gray-300",
                "transition-all duration-200 font-medium",
                "hover:-translate-y-0.5"
              )}
            >
              <List className="w-5 h-5" />
              <span>Voir les devis</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}