"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/devisUtils";
import { Percent, Calculator } from "lucide-react";

interface RemiseGlobaleProps {
  totalHT: number;
  remiseGlobale: number;
  onChangeRemise: (remise: number) => void;
  className?: string;
}

/**
 * Composant de gestion de remise globale
 * Input + preview impact + validation
 */
export function RemiseGlobale({ 
  totalHT, 
  remiseGlobale, 
  onChangeRemise,
  className 
}: RemiseGlobaleProps) {
  
  const [inputValue, setInputValue] = useState(remiseGlobale.toString());
  const [isEditing, setIsEditing] = useState(false);

  // Calculs
  const montantRemise = (totalHT * remiseGlobale) / 100;
  const totalApresRemise = totalHT - montantRemise;
  
  // Validation et sauvegarde
  const handleSave = () => {
    const newRemise = parseFloat(inputValue);
    if (isNaN(newRemise) || newRemise < 0 || newRemise > 50) {
      setInputValue(remiseGlobale.toString());
      setIsEditing(false);
      return;
    }
    
    onChangeRemise(newRemise);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setInputValue(remiseGlobale.toString());
      setIsEditing(false);
    }
  };

  return (
    <div className={cn(
      "p-4 rounded-lg border border-gray-100/20",
      "bg-gray-100/5 backdrop-blur-sm",
      className
    )}>
      {/* Header */}
      <div className="flex items-center space-x-2 mb-4">
        <Percent className="w-4 h-4 text-orange-600 dark:text-orange-400" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Remise Globale
        </span>
      </div>

      {/* Input remise */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className={cn(
                "w-16 px-2 py-1 text-sm rounded border",
                "bg-gray-100/20 border-orange-500/50 text-gray-900 dark:text-gray-100",
                "focus:outline-none focus:ring-1 focus:ring-orange-500"
              )}
              autoFocus
            />
          ) : (
            <div
              onClick={() => setIsEditing(true)}
              className={cn(
                "w-16 px-2 py-1 text-sm rounded border cursor-pointer",
                "bg-gray-100/10 border-gray-100/20 text-gray-900 dark:text-gray-100",
                "hover:bg-orange-100 dark:hover:bg-orange-800/30 transition-colors"
              )}
            >
              {remiseGlobale}
            </div>
          )}
          <span className="text-sm text-gray-600 dark:text-gray-400">%</span>
          <span className="text-xs text-gray-500">(max 50%)</span>
        </div>

        {/* Aperçu des calculs */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Total avant remise:</span>
            <span className="font-medium">{formatPrice(totalHT)}</span>
          </div>
          
          {remiseGlobale > 0 && (
            <>
              <div className="flex justify-between text-orange-600 dark:text-orange-400">
                <span>Remise ({remiseGlobale}%):</span>
                <span>-{formatPrice(montantRemise)}</span>
              </div>
              
              <div className="flex justify-between pt-2 border-t border-gray-100/10 font-semibold">
                <span>Total après remise:</span>
                <span className="text-green-600 dark:text-green-400">
                  {formatPrice(totalApresRemise)}
                </span>
              </div>
              
              <div className="text-xs text-gray-500 text-center">
                Économie: {formatPrice(montantRemise)}
              </div>
            </>
          )}
        </div>

        {/* Boutons rapides */}
        <div className="flex space-x-1 mt-3">
          {[5, 10, 15, 20].map(remise => (
            <button
              key={remise}
              onClick={() => onChangeRemise(remise)}
              className={cn(
                "flex-1 py-1 px-2 text-xs rounded transition-colors",
                remiseGlobale === remise 
                  ? "bg-orange-500 text-white" 
                  : "bg-gray-100/20 text-gray-600 dark:text-gray-400 hover:bg-orange-100 dark:hover:bg-orange-800/30"
              )}
            >
              {remise}%
            </button>
          ))}
          
          {remiseGlobale > 0 && (
            <button
              onClick={() => onChangeRemise(0)}
              className="px-2 py-1 text-xs rounded bg-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/30"
            >
              ✕
            </button>
          )}
        </div>

        {/* Message d'info */}
        {remiseGlobale > 25 && (
          <div className="mt-3 p-2 rounded bg-yellow-500/10 border border-yellow-500/20">
            <div className="flex items-center space-x-1 text-xs text-yellow-700 dark:text-yellow-300">
              <Calculator className="w-3 h-3" />
              <span>Remise importante: vérifiez l'impact sur la marge</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}