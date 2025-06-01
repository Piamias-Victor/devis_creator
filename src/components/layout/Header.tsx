"use client";

import { cn } from "@/lib/utils/cn";
import { useSession, signOut } from "next-auth/react";
import { FileText, Settings, User, LogOut } from "lucide-react";
import { useState } from "react";

/**
 * Header principal avec authentification
 * Affiche utilisateur connecté + déconnexion
 */
export function Header() {
  const { data: session } = useSession();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/auth/login" });
  };

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
            
            {/* Menu utilisateur */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={cn(
                  "flex items-center space-x-2 p-2 rounded-lg transition-all duration-200",
                  "bg-gray-100 hover:bg-gray-200 border border-gray100",
                  "backdrop-blur-sm hover:backdrop-blur-md",
                  "text-gray-700 dark:text-gray-300"
                )}
              >
                <User className="w-5 h-5" />
                <span className="text-sm font-medium hidden md:block">
                  {session?.user?.name || "Utilisateur"}
                </span>
              </button>

              {/* Dropdown menu */}
              {showUserMenu && (
                <div className={cn(
                  "absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-10",
                  "bg-white/90 backdrop-blur-md border border-gray-200",
                  "supports-[backdrop-filter]:bg-white/90"
                )}>
                  <div className="p-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {session?.user?.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {session?.user?.email}
                    </p>
                    <span className={cn(
                      "inline-block mt-1 px-2 py-1 rounded-full text-xs",
                      "bg-blue-100 text-blue-700"
                    )}>
                      {session?.user?.role}
                    </span>
                  </div>
                  
                  <button
                    onClick={handleSignOut}
                    className={cn(
                      "w-full flex items-center space-x-2 px-3 py-2 text-left",
                      "hover:bg-red-50 text-red-600 transition-colors"
                    )}
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Se déconnecter</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}