import { cn } from "@/lib/utils/cn";
import { StatusBadge } from "./StatusBadge";
import { 
  Clock, 
  User, 
  MessageSquare,
  ChevronDown,
  ChevronUp,
  History
} from "lucide-react";
import { useState } from "react";

// Fonction pour calculer le temps relatif sans date-fns
function timeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'à l\'instant';
  if (diffInSeconds < 3600) return `il y a ${Math.floor(diffInSeconds / 60)} min`;
  if (diffInSeconds < 86400) return `il y a ${Math.floor(diffInSeconds / 3600)} h`;
  if (diffInSeconds < 2592000) return `il y a ${Math.floor(diffInSeconds / 86400)} j`;
  return `il y a ${Math.floor(diffInSeconds / 2592000)} mois`;
}

export interface StatusChange {
  id: string;
  previousStatus: string;
  newStatus: string;
  changedAt: Date;
  changedBy?: string;
  note?: string;
}

interface StatusHistoryProps {
  changes: StatusChange[];
  currentStatus: string;
  className?: string;
  maxHeight?: string;
}

/**
 * Historique des changements de statut avec timeline glassmorphism
 * Affichage chronologique avec détails et notes
 */
export function StatusHistory({ 
  changes, 
  currentStatus,
  className,
  maxHeight = "max-h-96"
}: StatusHistoryProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAll, setShowAll] = useState(false);

  if (changes.length === 0) {
    return (
      <div className={cn(
        "p-6 rounded-xl border border-gray-200",
        "bg-white/5 backdrop-blur-md text-center",
        className
      )}>
        <History className="w-8 h-8 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600 dark:text-gray-400">
          Aucun historique de statut disponible
        </p>
      </div>
    );
  }

  // Limiter l'affichage par défaut aux 3 derniers changements
  const displayedChanges = showAll ? changes : changes.slice(0, 3);
  const hasMore = changes.length > 3;

  return (
    <div className={cn(
      "rounded-xl border border-gray-200",
      "bg-white/5 backdrop-blur-md overflow-hidden",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <History className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            Historique des statuts
          </h3>
          <span className="text-sm text-gray-500">
            ({changes.length} modification{changes.length > 1 ? 's' : ''})
          </span>
        </div>
        
        {hasMore && (
          <button
            onClick={() => setShowAll(!showAll)}
            className={cn(
              "flex items-center space-x-1 px-3 py-1 rounded-lg text-sm",
              "hover:bg-gray-100/50 text-gray-600 hover:text-gray-800",
              "transition-colors duration-200"
            )}
          >
            <span>{showAll ? "Voir moins" : "Voir tout"}</span>
            {showAll ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Timeline */}
      <div className={cn(
        "overflow-y-auto",
        maxHeight
      )}>
        <div className="p-4 space-y-4">
          {displayedChanges.map((change, index) => {
            const isFirst = index === 0;
            const isLast = index === displayedChanges.length - 1;
            
            return (
              <div
                key={change.id}
                className="relative flex items-start space-x-4"
              >
                {/* Timeline line */}
                {!isLast && (
                  <div className="absolute left-6 top-12 w-0.5 h-full bg-gray-200 dark:bg-gray-700" />
                )}
                
                {/* Status badge */}
                <div className="flex-shrink-0 mt-1">
                  <div className={cn(
                    "w-12 h-12 rounded-full border-4 flex items-center justify-center",
                    "bg-white border-gray-200 shadow-lg",
                    isFirst && "ring-2 ring-blue-500/30"
                  )}>
                    <StatusBadge 
                      status={change.newStatus as any} 
                      size="sm" 
                      showIcon={true}
                      className="border-0 bg-transparent p-0"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className={cn(
                    "p-4 rounded-lg border transition-all duration-200",
                    "bg-gray-50/50 border-gray-200 hover:bg-gray-50",
                    isFirst && "border-blue-300 bg-blue-50/50"
                  )}>
                    {/* Header change */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">
                          Passage à
                        </span>
                        <StatusBadge status={change.newStatus as any} size="sm" />
                        {change.previousStatus && (
                          <>
                            <span className="text-xs text-gray-500">depuis</span>
                            <StatusBadge status={change.previousStatus as any} size="sm" />
                          </>
                        )}
                      </div>
                      
                      {isFirst && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                          Actuel
                        </span>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center space-x-4 text-xs text-gray-600 mb-3">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>
                          {timeAgo(change.changedAt)}
                        </span>
                      </div>
                      
                      {change.changedBy && (
                        <div className="flex items-center space-x-1">
                          <User className="w-3 h-3" />
                          <span>{change.changedBy}</span>
                        </div>
                      )}
                    </div>

                    {/* Note */}
                    {change.note && (
                      <div className="flex items-start space-x-2">
                        <MessageSquare className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700 italic">
                          "{change.note}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer info */}
      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/30">
        <p className="text-xs text-gray-500 text-center">
          📈 Statut actuel: <StatusBadge status={currentStatus as any} size="sm" />
          • {changes.length} modification{changes.length > 1 ? 's' : ''} au total
        </p>
      </div>
    </div>
  );
}