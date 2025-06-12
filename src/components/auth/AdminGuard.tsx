"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { Shield, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface AdminGuardProps {
  children: React.ReactNode;
}

/**
 * Garde d'accès admin - Protège les pages d'administration
 * Vérifie que l'utilisateur connecté a le rôle admin
 */
export function AdminGuard({ children }: AdminGuardProps) {
  const { currentUser, isAdmin, loading } = useAuth();

  // État de chargement
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className={cn(
          "flex items-center space-x-3 p-6 rounded-xl",
          "bg-white/40 backdrop-blur-lg border border-white/20",
          "shadow-xl shadow-blue-500/10"
        )}>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-gray-700 font-medium">Vérification des permissions...</span>
        </div>
      </div>
    );
  }

  // Utilisateur non admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className={cn(
          "max-w-md w-full mx-4 p-8 rounded-xl",
          "bg-white/40 backdrop-blur-lg border border-white/20",
          "shadow-xl shadow-red-500/10"
        )}>
          <div className="text-center">
            <div className={cn(
              "mx-auto w-16 h-16 mb-6 rounded-full flex items-center justify-center",
              "bg-red-500/20 backdrop-blur-sm border border-red-500/30"
            )}>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Accès Refusé
            </h1>
            
            <p className="text-gray-600 mb-6">
              Cette page est réservée aux administrateurs. 
              Vous êtes connecté en tant que <strong>{currentUser?.role}</strong>.
            </p>
            
            <div className="space-y-3">
              <div className={cn(
                "p-3 rounded-lg",
                "bg-blue-500/10 border border-blue-500/20"
              )}>
                <div className="flex items-center space-x-2 text-sm text-blue-700">
                  <Shield className="w-4 h-4" />
                  <span>Utilisateur: {currentUser?.fullName}</span>
                </div>
              </div>
              
              <button 
                onClick={() => window.history.back()}
                className={cn(
                  "w-full py-3 px-4 rounded-lg font-medium transition-all duration-200",
                  "bg-gradient-to-r from-blue-600 to-purple-600 text-white",
                  "hover:from-blue-700 hover:to-purple-700",
                  "shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30"
                )}
              >
                Retour à la page précédente
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Utilisateur admin - autoriser l'accès
  return <>{children}</>;
}