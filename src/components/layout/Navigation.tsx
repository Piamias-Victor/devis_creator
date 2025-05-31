"use client";

import { cn } from "@/lib/utils/cn";
import { 
  Home, 
  FileText, 
  Users, 
  Package,
  BarChart3,
  Archive
} from "lucide-react";
import { useState } from "react";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Tableau de bord", icon: Home, href: "/" },
  { id: "devis", label: "Créer un devis", icon: FileText, href: "/devis/new" },
  { id: "clients", label: "Clients", icon: Users, href: "/clients", badge: 12 },
  { id: "products", label: "Produits", icon: Package, href: "/products" },
  { id: "stats", label: "Statistiques", icon: BarChart3, href: "/stats" },
  { id: "archive", label: "Archives", icon: Archive, href: "/archive" },
];

/**
 * Navigation latérale avec glassmorphism
 * Design premium desktop-first
 */
export function Navigation() {
  const [activeItem, setActiveItem] = useState("dashboard");

  return (
    <nav className={cn(
      "fixed left-0 top-20 h-[calc(100vh-80px)] w-64",
      "bg-white/5 backdrop-blur-md border-r border-gray100",
      "supports-[backdrop-filter]:bg-white/5"
    )}>
      <div className="p-6">
        <div className="space-y-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveItem(item.id);
                  // Navigation simple - en production utiliser Next.js router
                  if (item.href === "/clients") {
                    window.location.href = "/clients";
                  } else if (item.href === "/devis/new") {
                    window.location.href = "/devis/new";
                  } else if (item.href === "/products") {
                    window.location.href = "/products";
                  } else if (item.href === "/") {
                    window.location.href = "/";
                  }
                }}
                className={cn(
                  "w-full flex items-center space-x-3 px-4 py-3 rounded-lg",
                  "transition-all duration-200 text-left",
                  isActive ? [
                    "bg-gradient-to-r from-blue-500/20 to-purple-600/20",
                    "border border-blue-500/30 text-blue-700 dark:text-blue-300",
                    "shadow-lg shadow-blue-500/10"
                  ] : [
                    "hover:bg-gray-100 border border-transparent",
                    "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                  ]
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium flex-1">{item.label}</span>
                {item.badge && (
                  <span className={cn(
                    "px-2 py-1 text-xs rounded-full",
                    "bg-blue-500/20 text-blue-700 dark:text-blue-300",
                    "border border-blue-500/30"
                  )}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}