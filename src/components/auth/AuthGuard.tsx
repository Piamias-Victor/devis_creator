"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface AuthGuardProps {
  children: ReactNode;
}

/**
 * Garde d'authentification
 * Redirige vers login si non connecté
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  // Loading pendant vérification
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Vérification...</p>
        </div>
      </div>
    );
  }

  // Pas connecté
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className={cn(
          "p-8 rounded-xl text-center",
          "bg-white/10 backdrop-blur-md border border-white/20"
        )}>
          <p className="text-gray-600 dark:text-gray-400">Redirection vers la connexion...</p>
        </div>
      </div>
    );
  }

  // Connecté - afficher l'application
  return <>{children}</>;
}