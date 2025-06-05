"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils/cn";
import { DevisLine } from "@/types";
import { formatEuros, formatPourcent, getMargeColorClass, formatPriceUnit, parsePriceInput } from "@/lib/utils/calculUtils";
import { Trash2, Copy, Package, Save } from "lucide-react";

interface DevisTableRowProps {
  ligne: DevisLine;
  onUpdate: (id: string, updates: Partial<DevisLine>) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onSaveToDatabase?: (ligne: DevisLine) => Promise<void>; // NOUVELLE PROP
}

/**
 * Ligne tableau AVEC bouton sauvegarde DB
 * Permet d'enregistrer les modifications directement en base
 */
export function DevisTableRow({ 
  ligne, 
  onUpdate, 
  onDelete, 
  onDuplicate,
  onSaveToDatabase // NOUVELLE PROP
}: DevisTableRowProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus automatique lors de l'édition
  useEffect(() => {
    if (editingField && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingField]);

  // Commencer l'édition avec formatage adapté
  const startEdit = (field: string, currentValue: number) => {
    setEditingField(field);
    
    if (field === "prixAchat" || field === "prixUnitaire") {
      setEditValue(currentValue.toFixed(4));
    } else {
      setEditValue(currentValue.toString());
    }
  };

  // Sauvegarder l'édition avec validation
  const saveEdit = () => {
    if (!editingField) return;
    
    let numValue: number;
    
    if (editingField === "prixAchat" || editingField === "prixUnitaire") {
      numValue = parsePriceInput(editValue);
    } else {
      numValue = parseFloat(editValue.replace(',', '.'));
      if (isNaN(numValue) || numValue < 0) {
        cancelEdit();
        return;
      }
    }

    // Validations spécifiques
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

  // NOUVEAU : Sauvegarder ligne en base de données
  const handleSaveToDatabase = async () => {
    if (!onSaveToDatabase) {
      alert("Fonctionnalité de sauvegarde non disponible");
      return;
    }

    if (!confirm(`Enregistrer les modifications de "${ligne.designation}" en base de données ?`)) {
      return;
    }

    try {
      setSaving(true);
      await onSaveToDatabase(ligne);
      console.log('✅ Ligne sauvegardée en DB:', ligne.designation);
    } catch (error) {
      console.error('❌ Erreur sauvegarde ligne:', error);
      alert('Erreur lors de la sauvegarde en base de données');
    } finally {
      setSaving(false);
    }
  };

  // Supprimer avec confirmation
  const handleDelete = () => {
    if (confirm("Supprimer cette ligne du devis ?")) {
      onDelete(ligne.id);
    }
  };

  const nbColis = ligne.colissage ? Math.ceil(ligne.quantite / ligne.colissage) : null;
  const margeStyle = getMargeColorClass(ligne.margePourcent || 0);

  return (
    <tr className={cn(
      "transition-colors duration-200 border-b border-gray-100/5",
      "hover:bg-gray-100/5 group"
    )}>
      {/* 1. Code produit */}
      <td className="px-3 py-3">
        <span className="text-xs font-mono text-gray-700 dark:text-gray-300">
          {ligne.productCode}
        </span>
      </td>

      {/* 2. Désignation */}
      <td className="px-3 py-3">
        <div className="text-sm text-gray-900 dark:text-gray-100 truncate">
          {ligne.designation}
        </div>
      </td>

      {/* 3. Quantité - Éditable */}
      <td className="px-3 py-3">
        {editingField === "quantite" ? (
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={saveEdit}
            className="w-12 px-1 py-1 text-xs rounded border bg-blue-100/20 border-blue-500/50"
          />
        ) : (
          <div
            onDoubleClick={() => startEdit("quantite", ligne.quantite)}
            className="text-sm cursor-pointer px-1 py-1 rounded hover:bg-blue-100/30 transition-colors"
            title="Double-cliquer pour modifier"
          >
            {ligne.quantite}
          </div>
        )}
      </td>

      {/* 4. Prix d'achat - Éditable 4 décimales */}
      <td className="px-3 py-3">
        {editingField === "prixAchat" ? (
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={saveEdit}
            placeholder="0,0000"
            className="w-20 px-1 py-1 text-xs rounded border bg-green-100/20 border-green-500/50"
          />
        ) : (
          <div
            onDoubleClick={() => startEdit("prixAchat", ligne.prixAchat || 0)}
            className="text-xs cursor-pointer px-1 py-1 rounded hover:bg-green-100/30 transition-colors"
            title="Double-cliquer pour modifier (4 décimales)"
          >
            {ligne.prixAchat ? formatPriceUnit(ligne.prixAchat) : "–"}
          </div>
        )}
      </td>

      {/* 5. Remise - Éditable */}
      <td className="px-3 py-3">
        {editingField === "remise" ? (
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={saveEdit}
            className="w-12 px-1 py-1 text-xs rounded border bg-orange-100/20 border-orange-500/50"
          />
        ) : (
          <div
            onDoubleClick={() => startEdit("remise", ligne.remise)}
            className="text-xs cursor-pointer px-1 py-1 rounded hover:bg-orange-100/30 transition-colors"
            title="Double-cliquer pour modifier"
          >
            {ligne.remise}%
          </div>
        )}
      </td>

      {/* 6. Prix de vente après remise - Éditable 4 décimales */}
      <td className="px-3 py-3">
        {editingField === "prixUnitaire" ? (
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={saveEdit}
            placeholder="0,0000"
            className="w-20 px-1 py-1 text-xs rounded border bg-purple-100/20 border-purple-500/50"
          />
        ) : (
          <div
            onDoubleClick={() => startEdit("prixUnitaire", ligne.prixUnitaire)}
            className="text-xs cursor-pointer px-1 py-1 rounded hover:bg-purple-100/30 transition-colors"
            title="Double-cliquer pour modifier (4 décimales)"
          >
            {formatPriceUnit(ligne.prixApresRemise || ligne.prixUnitaire)}
          </div>
        )}
      </td>

      {/* 7. TVA% */}
      <td className="px-3 py-3">
        <span className="text-xs text-gray-600 dark:text-gray-400">
          {ligne.tva}%
        </span>
      </td>

      {/* 8. Marge */}
      <td className="px-3 py-3">
        <div className="text-xs">
          <div className={cn("font-semibold", margeStyle.text)}>
            {formatPourcent(ligne.margePourcent || 0)}
          </div>
          <div className="text-gray-500">
            {formatEuros(ligne.margeEuros || 0)}
          </div>
        </div>
      </td>

      {/* 9. Total HT */}
      <td className="px-3 py-3">
        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
          {formatEuros(ligne.totalHT || 0)}
        </span>
      </td>

      {/* 10. Total TVA */}
      <td className="px-3 py-3">
        <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
          {formatEuros(ligne.totalTVA || 0)}
        </span>
      </td>

      {/* 11. Total TTC */}
      <td className="px-3 py-3">
        <span className="text-sm font-bold text-green-600 dark:text-green-400">
          {formatEuros(ligne.totalTTC || 0)}
        </span>
      </td>

      {/* 12. Actions ÉTENDUES */}
      <td className="px-3 py-3">
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* NOUVEAU : Bouton Sauvegarder en DB */}
          {onSaveToDatabase && (
            <button
              onClick={handleSaveToDatabase}
              disabled={saving}
              className={cn(
                "p-1 rounded transition-colors",
                saving 
                  ? "bg-gray-500/20 text-gray-400 cursor-not-allowed"
                  : "hover:bg-green-500/20 text-green-600 dark:text-green-400"
              )}
              title="Enregistrer en base de données"
            >
              <Save className={cn("w-3 h-3", saving && "animate-pulse")} />
            </button>
          )}
          
          <button
            onClick={() => onDuplicate(ligne.id)}
            className="p-1 rounded hover:bg-blue-500/20 text-blue-600 dark:text-blue-400"
            title="Dupliquer"
          >
            <Copy className="w-3 h-3" />
          </button>
          
          <button
            onClick={handleDelete}
            className="p-1 rounded hover:bg-red-500/20 text-red-600 dark:text-red-400"
            title="Supprimer"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </td>
    </tr>
  );
}