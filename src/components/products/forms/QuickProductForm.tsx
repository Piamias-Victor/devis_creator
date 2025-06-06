"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils/cn";
import { Zap, Package } from "lucide-react";

interface QuickProductData {
  code: string;
  designation: string;
  prixAchat: number;
  tva: number;
  colissage: number;
}

interface QuickProductFormProps {
  suggestedCode: string;
  onSubmit: (data: QuickProductData) => void;
  onCancel: () => void;
  loading: boolean;
  errors: string[];
}

/**
 * Formulaire création rapide produit
 * Composant spécialisé < 80 lignes
 */
export function QuickProductForm({
  suggestedCode,
  onSubmit,
  onCancel,
  loading,
  errors
}: QuickProductFormProps) {
  const [formData, setFormData] = useState<QuickProductData>({
    code: "",
    designation: "",
    prixAchat: 0,
    tva: 20,
    colissage: 1
  });

  // Initialiser avec code suggéré
  useEffect(() => {
    setFormData(prev => ({ ...prev, code: suggestedCode }));
  }, [suggestedCode]);

  // Calculs automatiques (marge 10%)
  const prixVenteCalcule = formData.prixAchat * 1.10;
  const margeCalculee = formData.prixAchat > 0 ? 10.0 : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof QuickProductData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'code' || field === 'designation' 
        ? value 
        : Number(value) || (field === 'tva' ? 20 : field === 'colissage' ? 1 : 0)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-5">
      {/* Code (pré-rempli et readonly) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Code produit
        </label>
        <input
          type="text"
          value={formData.code}
          readOnly
          className="w-full px-4 py-3 rounded-lg border bg-gray-100 text-gray-700 font-mono text-lg border-gray-300 cursor-not-allowed"
        />
        <p className="text-xs text-gray-500 mt-1">
          ⚡ Code détecté automatiquement depuis votre saisie
        </p>
      </div>

      {/* Désignation */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nom du produit *
        </label>
        <input
          type="text"
          value={formData.designation}
          onChange={(e) => handleChange("designation", e.target.value)}
          className="w-full px-4 py-3 rounded-lg border bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500"
          placeholder="Ex: MoliCare Premium Fixpants..."
          required
          autoFocus
        />
      </div>

      {/* Prix d'achat et Colissage */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prix d'achat HT * (€)
          </label>
          <input
            type="number"
            step="0.0001"
            min="0.0001"
            value={formData.prixAchat || ""}
            onChange={(e) => handleChange("prixAchat", parseFloat(e.target.value) || 0)}
            className="w-full px-4 py-3 rounded-lg border bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500"
            placeholder="0,0000"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Colissage (unités)
          </label>
          <input
            type="number"
            min="1"
            value={formData.colissage || ""}
            onChange={(e) => handleChange("colissage", parseInt(e.target.value) || 1)}
            className="w-full px-4 py-3 rounded-lg border bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500"
          />
        </div>
      </div>

      {/* TVA */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          TVA (%)
        </label>
        <input
          type="number"
          min="0"
          max="100"
          value={formData.tva}
          onChange={(e) => handleChange("tva", parseFloat(e.target.value) || 20)}
          className="w-full px-4 py-3 rounded-lg border bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500"
        />
      </div>

      {/* Prévisualisation calculs */}
      {formData.prixAchat > 0 && (
        <div className="p-4 rounded-lg border-2 border-dashed bg-green-50 border-green-300">
          <h4 className="font-medium text-green-900 mb-3 flex items-center space-x-2">
            <Package className="w-4 h-4" />
            <span>✨ Calculs automatiques (marge 10%)</span>
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-white rounded-lg border border-green-200">
              <span className="text-green-700 text-sm block">Prix de vente HT</span>
              <div className="font-bold text-green-900 text-lg">
                {prixVenteCalcule.toFixed(4)}€
              </div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-green-200">
              <span className="text-green-700 text-sm block">Marge calculée</span>
              <div className="font-bold text-green-900 text-lg">
                {margeCalculee.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Erreurs */}
      {errors.length > 0 && (
        <div className="p-4 rounded-lg bg-red-50 border-2 border-red-200">
          <h4 className="font-medium text-red-800 mb-2">⚠️ Erreurs à corriger :</h4>
          <ul className="text-sm text-red-700 space-y-1">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-3 pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={loading}
          className={cn(
            "flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-lg font-medium",
            "bg-orange-600 hover:bg-orange-700 text-white transition-all duration-200",
            "shadow-lg shadow-orange-600/25 hover:shadow-xl hover:shadow-orange-600/30",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "hover:-translate-y-0.5"
          )}
        >
          <Zap className="w-4 h-4" />
          <span>
            {loading ? "Création..." : "Créer et ajouter au devis"}
          </span>
        </button>
        
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-6 py-3 rounded-lg font-medium transition-all duration-200 bg-gray-100 hover:bg-gray-200 border text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}