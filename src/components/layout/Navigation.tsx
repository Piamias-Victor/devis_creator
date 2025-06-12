"use client";

import { cn } from "@/lib/utils/cn";
import { 
  Home, 
  FileText, 
  Users, 
  Package,
  BarChart3,
  Archive,
  List,
  Shield
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: number;
  adminOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Tableau de bord", icon: Home, href: "/" },
  { id: "devis-new", label: "Créer un devis", icon: FileText, href: "/devis/new" },
  { id: "devis-list", label: "Mes devis", icon: List, href: "/devis" },
  { id: "clients", label: "Clients", icon: Users, href: "/clients" },
  { id: "products", label: "Produits", icon: Package, href: "/products" },
  { id: "stats", label: "Statistiques", icon: BarChart3, href: "/stats", adminOnly: true },
  { id: "archive", label: "Archives", icon: Archive, href: "/archive" },
  { id: "admin", label: "Administration", icon: Shield, href: "/admin", adminOnly: true },
];

/**
 * Navigation latérale compacte avec glassmorphism
 * Sidebar rétractable : icônes par défaut + extension au hover
 */
export function Navigation() {
  const [activeItem, setActiveItem] = useState("dashboard");
  const router = useRouter();
  const { isAdmin } = useAuth();

  const handleNavigation = (item: NavItem) => {
    setActiveItem(item.id);
    router.push(item.href);
  };

  // Filtrer les éléments selon les permissions
  const visibleItems = NAV_ITEMS.filter(item => {
    if (item.adminOnly && !isAdmin) return false;
    return true;
  });

  return (
    <nav className={cn(
      "fixed left-0 top-20 h-[calc(100vh-80px)] transition-all duration-300 group z-40",
      "w-16 hover:w-64",
      "bg-white/5 backdrop-blur-md border-r border-gray-100",
      "supports-[backdrop-filter]:bg-white/5"
    )}>
      <div className="p-3 group-hover:p-6 transition-all duration-300">
        <div className="space-y-2">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item)}
                className={cn(
                  "w-full flex items-center rounded-lg relative overflow-hidden",
                  "transition-all duration-200 text-left",
                  "px-3 py-3 group-hover:px-4 group-hover:space-x-3",
                  isActive ? [
                    "bg-gradient-to-r from-blue-500/20 to-purple-600/20",
                    "border border-blue-500/30 text-blue-700 dark:text-blue-300",
                    "shadow-lg shadow-blue-500/10"
                  ] : [
                    "hover:bg-gray-100/50 border border-transparent",
                    "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                  ]
                )}
                title={item.label}
              >
                <Icon className={cn(
                  "w-5 h-5 flex-shrink-0",
                  item.adminOnly
                )} />
                
                {/* Label avec animation d'apparition */}
                <span className={cn(
                  "font-medium whitespace-nowrap transition-all duration-300",
                  "opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0",
                  "absolute left-12 group-hover:relative group-hover:left-0"
                )}>
                  {item.label}
                </span>
                                
                
                {/* Badge normal */}
                {item.badge && !item.adminOnly && (
                  <span className={cn(
                    "px-2 py-1 text-xs rounded-full transition-all duration-300 ml-auto",
                    "bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30",
                    "opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100"
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