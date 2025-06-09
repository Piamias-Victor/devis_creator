"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export interface CurrentUser {
  id: string;
  email: string;
  nom: string;
  prenom?: string;
  role: 'admin' | 'pharmacien' | 'assistant';
  fullName: string;
}

interface UseAuthReturn {
  currentUser: CurrentUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  canCreateDevis: boolean;
  canEditProducts: boolean;
  canManageUsers: boolean;
}

/**
 * Hook authentification et permissions
 * CORRIGÉ - Accès sécurisé aux propriétés session
 */
export function useAuth(): UseAuthReturn {
  const { data: session, status } = useSession();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  // ✅ CONSTRUCTION UTILISATEUR CORRIGÉE avec vérifications
  useEffect(() => {
    if (session?.user) {
      // ✅ Accès sécurisé aux propriétés avec fallbacks
      const sessionUser = session.user as any; // Cast temporaire pour accéder aux props custom
      
      const user: CurrentUser = {
        id: sessionUser.userId || sessionUser.id || '',
        email: sessionUser.email || '',
        nom: sessionUser.nom || '',
        prenom: sessionUser.prenom || undefined,
        role: (sessionUser.role as 'admin' | 'pharmacien' | 'assistant') || 'pharmacien',
        fullName: sessionUser.name || `${sessionUser.prenom || ''} ${sessionUser.nom || ''}`.trim()
      };
      
      setCurrentUser(user);
      console.log('👤 Utilisateur connecté:', user.fullName, '- Rôle:', user.role);
    } else {
      setCurrentUser(null);
    }
  }, [session]);

  // Permissions selon le rôle
  const permissions = {
    canCreateDevis: currentUser?.role !== undefined, // Tous les utilisateurs connectés
    canEditProducts: currentUser?.role === 'admin' || currentUser?.role === 'pharmacien',
    canManageUsers: currentUser?.role === 'admin'
  };

  return {
    currentUser,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === 'admin',
    loading: status === 'loading',
    ...permissions
  };
}