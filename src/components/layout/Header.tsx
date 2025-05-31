"use client";

import { cn } from "@/lib/utils/cn";
import { FileText, Settings, User } from "lucide-react";

/**
 * Header principal avec glassmorphism
 * Navigation et actions utilisateur
 */
export function Header() {
  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b border-gray100",
      "bg-white/5 backdrop-blur-md",
      "supports-[backdrop-filter]:bg-white/5"
    )}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo et titre */}
          <div className="flex items-center space-x-3">
            <div className={cn(
              "p-2 rounded-lg",
              "bg-gradient-to-br from-blue-500/20 to-purple-600/20",
              "border border-gray100 backdrop-blur-sm"
            )}>
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Créateur de Devis
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Pharmacie & EHPAD Pro
              </p>
            </div>
          </div>

          {/* Actions utilisateur */}
          <div className="flex items-center space-x-3">
            <button className={cn(
              "p-2 rounded-lg transition-all duration-200",
              "bg-gray-100 hover:bg-gray-200 border border-gray100",
              "backdrop-blur-sm hover:backdrop-blur-md",
              "text-gray-700 dark:text-gray-300"
            )}>
              <Settings className="w-5 h-5" />
            </button>
            
            <button className={cn(
              "p-2 rounded-lg transition-all duration-200", 
              "bg-gray-100 hover:bg-gray-200 border border-gray100",
              "backdrop-blur-sm hover:backdrop-blur-md",
              "text-gray-700 dark:text-gray-300"
            )}>
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}