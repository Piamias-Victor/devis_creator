"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils/cn";
import { DevisLine } from "@/types";
import { formatPrice, calculateLineTotal, calculateMarge } from "@/lib/utils/devisUtils";
import { Trash2, Copy, Package, TrendingUp } from "lucide-react";

interface DevisTableRowProps {
  ligne: DevisLine;
  onUpdate: (id: string, updates: Partial<DevisLine>) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}

/**
 * Ligne de tableau devis - Structure finale
 * Code / Nom / Qté / Colis / Prix Achat HT / Remise / Prix Vente HT / Marge / Total HT
 */
export function DevisTableRow({ ligne, onUpdate, onDelete, onDuplicate }: DevisTableRowProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus automatique lors de l'édition
  useEffect(() => {
    if (editingField && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingField]);

  // Commencer l'édition
  const startEdit = (field: string, currentValue: number) => {
    setEditingField(field);
    setEditValue(currentValue.toString());
  };

  // Sauvegarder l'édition
  const saveEdit = () => {
    if (!editingField) return;
    
    const numValue = parseFloat(editValue);
    if (isNaN(numValue) || numValue < 0) {
      cancelEdit();
      return;
    }

    // Validation spécifique par champ
    if (editingField === "quantite" && numValue === 0) {
      cancelEdit();
      return;
    }
    
    if (editingField === "remise" && numValue > 100) {
      cancelEdit();
      return;
    }

    onUpdate(ligne.id, { [editingField]: numValue });
    setEditingField(null);
  };

  // Annuler l'édition
  const cancelEdit = () => {
    setEditingField(null);
    setEditValue("");
  };

  // Gestion des touches
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveEdit();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  // Supprimer avec confirmation
  const handleDelete = () => {
    if (confirm("Supprimer cette ligne du devis ?")) {
      onDelete(ligne.id);
    }
  };

  // Calculs
  const totalLigne = calculateLineTotal(ligne.quantite, ligne.prixUnitaire, ligne.remise);
  const nbColis = ligne.colissage ? Math.ceil(ligne.quantite / ligne.colissage) : null;
  const marge = ligne.prixAchat ? calculateMarge(ligne.prixUnitaire, ligne.prixAchat) : null;

  // Couleur de la marge
  const getMargeColor = (margePourcent: number) => {
    if (margePourcent >= 30) return "text-green-600 dark:text-green-400";
    if (margePourcent >= 20) return "text-blue-600 dark:text-blue-400";
    if (margePourcent >= 10) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <tr className={cn(
      "transition-colors duration-200 border-b border-gray-100/5",
      "hover:bg-gray-100/5 group"
    )}>
      {/* 1. Code produit */}
      <td className="px-4 py-3">
        <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
          {ligne.productCode}
        </span>
      </td>

      {/* 2. Désignation */}
      <td className="px-4 py-3">
        <div className="text-sm text-gray-900 dark:text-gray-100">
          {ligne.designation}
        </div>
      </td>

      {/* 3. Quantité - Éditable */}
      <td className="px-4 py-3">
        {editingField === "quantite" ? (
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={saveEdit}
            className={cn(
              "w-16 px-2 py-1 text-sm rounded border",
              "bg-gray-100/20 border-blue-500/50 text-gray-900 dark:text-gray-100",
              "focus:outline-none focus:ring-1 focus:ring-blue-500"
            )}
          />
        ) : (
          <div
            onDoubleClick={() => startEdit("quantite", ligne.quantite)}
            className={cn(
              "text-sm text-gray-900 dark:text-gray-100 cursor-pointer relative",
              "hover:bg-blue-100 dark:hover:bg-blue-800/30 px-2 py-1 rounded transition-all duration-200",
              "group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20",
              "border-2 border-transparent hover:border-blue-300 dark:hover:border-blue-600",
              "hover:shadow-md hover:shadow-blue-200 dark:hover:shadow-blue-900/30"
            )}
            title="Double-cliquer pour modifier"
          >
            {ligne.quantite}
            <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}
      </td>

      {/* 4. Nombre de colis */}
      <td className="px-4 py-3">
        <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
          <Package className="w-3 h-3" />
          <span>{nbColis || '-'}</span>
        </div>
      </td>

      {/* 5. Prix d'achat HT - Éditable */}
      <td className="px-4 py-3">
        {editingField === "prixAchat" ? (
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={saveEdit}
            className={cn(
              "w-20 px-2 py-1 text-sm rounded border",
              "bg-gray-100/20 border-green-500/50 text-gray-900 dark:text-gray-100",
              "focus:outline-none focus:ring-1 focus:ring-green-500"
            )}
          />
        ) : (
          <div
            onDoubleClick={() => startEdit("prixAchat", ligne.prixAchat || 0)}
            className={cn(
              "text-sm text-gray-900 dark:text-gray-100 cursor-pointer relative",
              "hover:bg-green-100 dark:hover:bg-green-800/30 px-2 py-1 rounded transition-all duration-200",
              "group-hover:bg-green-50 dark:group-hover:bg-green-900/20",
              "border-2 border-transparent hover:border-green-300 dark:hover:border-green-600",
              "hover:shadow-md hover:shadow-green-200 dark:hover:shadow-green-900/30"
            )}
            title="Double-cliquer pour modifier le prix d'achat"
          >
            {ligne.prixAchat ? formatPrice(ligne.prixAchat) : (
              <span className="text-gray-400 italic">Cliquer pour saisir</span>
            )}
            <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}
      </td>

      {/* 6. Remise - Éditable */}
      <td className="px-4 py-3">
        {editingField === "remise" ? (
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={saveEdit}
            className={cn(
              "w-16 px-2 py-1 text-sm rounded border",
              "bg-gray-100/20 border-orange-500/50 text-gray-900 dark:text-gray-100",
              "focus:outline-none focus:ring-1 focus:ring-orange-500"
            )}
          />
        ) : (
          <div
            onDoubleClick={() => startEdit("remise", ligne.remise)}
            className={cn(
              "text-sm text-gray-900 dark:text-gray-100 cursor-pointer relative",
              "hover:bg-orange-100 dark:hover:bg-orange-800/30 px-2 py-1 rounded transition-all duration-200",
              "group-hover:bg-orange-50 dark:group-hover:bg-orange-900/20",
              "border-2 border-transparent hover:border-orange-300 dark:hover:border-orange-600",
              "hover:shadow-md hover:shadow-orange-200 dark:hover:shadow-orange-900/30"
            )}
            title="Double-cliquer pour modifier la remise"
          >
            {ligne.remise}%
            <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}
      </td>

      {/* 7. Prix de vente HT - Éditable */}
      <td className="px-4 py-3">
        {editingField === "prixUnitaire" ? (
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={saveEdit}
            className={cn(
              "w-20 px-2 py-1 text-sm rounded border",
              "bg-gray-100/20 border-purple-500/50 text-gray-900 dark:text-gray-100",
              "focus:outline-none focus:ring-1 focus:ring-purple-500"
            )}
          />
        ) : (
          <div
            onDoubleClick={() => startEdit("prixUnitaire", ligne.prixUnitaire)}
            className={cn(
              "text-sm text-gray-900 dark:text-gray-100 cursor-pointer relative",
              "hover:bg-purple-100 dark:hover:bg-purple-800/30 px-2 py-1 rounded transition-all duration-200",
              "group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20",
              "border-2 border-transparent hover:border-purple-300 dark:hover:border-purple-600",
              "hover:shadow-md hover:shadow-purple-200 dark:hover:shadow-purple-900/30"
            )}
            title="Double-cliquer pour modifier le prix de vente"
          >
            {formatPrice(ligne.prixUnitaire)}
            <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}
      </td>

      {/* 8. Marge */}
      <td className="px-4 py-3">
        {marge ? (
          <div className="flex items-center space-x-1">
            <TrendingUp className="w-3 h-3 text-gray-400" />
            <div className="text-xs">
              <div className={cn("font-semibold", getMargeColor(marge.margePourcent))}>
                {marge.margePourcent.toFixed(1)}%
              </div>
              <div className="text-gray-500">
                +{formatPrice(marge.margeEuros)}
              </div>
            </div>
          </div>
        ) : (
          <span className="text-gray-400 text-xs">-</span>
        )}
      </td>

      {/* 9. Total ligne */}
      <td className="px-4 py-3">
        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {formatPrice(totalLigne)}
        </div>
      </td>

      {/* 10. Actions */}
      <td className="px-4 py-3">
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onDuplicate(ligne.id)}
            className={cn(
              "p-1 rounded hover:bg-blue-500/20 text-blue-600 dark:text-blue-400",
              "transition-colors duration-200"
            )}
            title="Dupliquer"
          >
            <Copy className="w-3 h-3" />
          </button>
          
          <button
            onClick={handleDelete}
            className={cn(
              "p-1 rounded hover:bg-red-500/20 text-red-600 dark:text-red-400",
              "transition-colors duration-200"
            )}
            title="Supprimer"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </td>
    </tr>
  );
}