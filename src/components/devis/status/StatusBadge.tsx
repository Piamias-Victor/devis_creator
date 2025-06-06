import { cn } from "@/lib/utils/cn";
import { DevisStatus } from "@/types";
import { 
  FileText, 
  Send, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertTriangle 
} from "lucide-react";

interface StatusBadgeProps {
  status: DevisStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

/**
 * Badge de statut avec glassmorphism
 * Couleurs et icônes selon l'état du devis
 */
export function StatusBadge({ 
  status, 
  size = 'md', 
  showIcon = true,
  className 
}: StatusBadgeProps) {
  
  // Configuration des statuts
  const statusConfig = {
    brouillon: {
      label: "Brouillon",
      icon: FileText,
      colors: "bg-gray-500/20 text-gray-700 border-gray-500/30 dark:text-gray-300",
      description: "En cours de rédaction"
    },
    envoye: {
      label: "Envoyé",
      icon: Send,
      colors: "bg-blue-500/20 text-blue-700 border-blue-500/30 dark:text-blue-300",
      description: "Transmis au client"
    },
    accepte: {
      label: "Accepté",
      icon: CheckCircle,
      colors: "bg-green-500/20 text-green-700 border-green-500/30 dark:text-green-300",
      description: "Validé par le client"
    },
    refuse: {
      label: "Refusé",
      icon: XCircle,
      colors: "bg-red-500/20 text-red-700 border-red-500/30 dark:text-red-300",
      description: "Rejeté par le client"
    },
    expire: {
      label: "Expiré",
      icon: Clock,
      colors: "bg-orange-500/20 text-orange-700 border-orange-500/30 dark:text-orange-300",
      description: "Date de validité dépassée"
    }
  };

  const config = statusConfig[status] || statusConfig.brouillon;
  const Icon = config.icon;

  // Tailles selon props
  const sizeClasses = {
    sm: "px-2 py-1 text-xs gap-1",
    md: "px-3 py-1.5 text-sm gap-2", 
    lg: "px-4 py-2 text-base gap-2"
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  };

  return (
    <span 
      className={cn(
        "inline-flex items-center rounded-full border font-medium",
        "backdrop-blur-sm transition-all duration-200",
        "hover:scale-105 hover:shadow-lg",
        config.colors,
        sizeClasses[size],
        className
      )}
      title={config.description}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      <span>{config.label}</span>
    </span>
  );
}