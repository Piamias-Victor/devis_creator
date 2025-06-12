"use client";

import { useState } from "react";
import { Users, UserPlus, Settings, Database, Activity } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { UserManagement } from "./UserManagement";

type AdminSection = 'users' | 'settings' | 'database' | 'analytics';

/**
 * Page d'administration principale
 * Navigation entre différentes sections d'administration
 */
export function AdminPage() {
  const [activeSection, setActiveSection] = useState<AdminSection>('users');

  const sections = [
    {
      id: 'users' as AdminSection,
      label: 'Gestion des Utilisateurs',
      icon: Users,
      description: 'Créer, modifier et gérer les comptes utilisateurs'
    },
    {
      id: 'settings' as AdminSection,
      label: 'Paramètres Système',
      icon: Settings,
      description: 'Configuration globale de l\'application'
    },
    {
      id: 'database' as AdminSection,
      label: 'Base de Données',
      icon: Database,
      description: 'Maintenance et sauvegarde des données'
    },
    {
      id: 'analytics' as AdminSection,
      label: 'Statistiques',
      icon: Activity,
      description: 'Analyse d\'utilisation et performances'
    }
  ];

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'users':
        return <UserManagement />;
      case 'settings':
        return <div className="p-8 text-center text-gray-500">Section Paramètres - À développer</div>;
      case 'database':
        return <div className="p-8 text-center text-gray-500">Section Base de données - À développer</div>;
      case 'analytics':
        return <div className="p-8 text-center text-gray-500">Section Statistiques - À développer</div>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className={cn(
        "p-6 rounded-xl border border-white/20",
        "bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm"
      )}>
        <div className="flex items-center space-x-3">
          <div className={cn(
            "p-3 rounded-lg",
            "bg-gradient-to-br from-purple-500/20 to-blue-500/20",
            "border border-purple-500/30 backdrop-blur-sm"
          )}>
            <Settings className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Administration
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gestion et configuration de l'application
            </p>
          </div>
        </div>
      </div>

      <div className="gap-6">
        {/* Navigation sections */}
        

        {/* Contenu de la section active */}
        <div className="lg:col-span-3">
          <div className={cn(
            "rounded-xl border border-white/20",
            "bg-white/40 backdrop-blur-sm min-h-[600px]"
          )}>
            {renderSectionContent()}
          </div>
        </div>
      </div>
    </div>
  );
}