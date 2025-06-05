"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils/cn";
import { X, Package } from "lucide-react";
import { Product } from "@/types";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: ProductFormData) => void;
  product?: Product | null;
  loading?: boolean;
}

// Interface pour les données du formulaire (compatible Supabase)
interface ProductFormData {
  code: string;
  designation: string;
  prix_achat: number;
  prix_vente: number;
  tva: number;
  colissage: number;
}

/**
 * Modal de création/modification de produit CORRIGÉE
 * Compatible avec Supabase + validation stricte
 */
export function ProductModal({
  isOpen,
  onClose,
  onSave,
  product,
  loading
}: ProductModalProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    code: "",
    designation: "",
    prix_achat: 0,
    prix_vente: 0,
    tva: 20,
    colissage: 1
  });

  const [errors, setErrors] = useState<string[]>([]);

  // Initialiser le formulaire avec produit existant ou valeurs par défaut
  useEffect(() => {
    if (product) {
      setFormData({
        code: product.code,
        designation: product.designation,
        prix_achat: product.prixAchat,
        prix_vente: product.prixVente,
        tva: product.tva,
        colissage: product.colissage
      });
    } else {
      setFormData({
        code: "",
        designation: "",
        prix_achat: 0,
        prix_vente: 0,
        tva: 20,
        colissage: 1
      });
    }
    setErrors([]);
  }, [product, isOpen]);

  // Validation du formulaire
  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!formData.code.trim()) {
      newErrors.push("Le code produit est obligatoire");
    }

    if (!formData.designation.trim()) {
      newErrors.push("La désignation est obligatoire");
    }

    if (!formData.prix_achat || formData.prix_achat <= 0) {
      newErrors.push("Le prix d'achat doit être supérieur à 0");
    }

    if (!formData.prix_vente || formData.prix_vente <= 0) {
      newErrors.push("Le prix de vente doit être supérieur à 0");
    }

    if (formData.tva < 0 || formData.tva > 100) {
      newErrors.push("La TVA doit être entre 0 et 100%");
    }

    if (!formData.colissage || formData.colissage < 1) {
      newErrors.push("Le colissage doit être d'au moins 1");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  // Gestion ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // Soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // IMPORTANT: Convertir en nombres pour éviter l'erreur NULL
    const sanitizedData: ProductFormData = {
      code: formData.code.trim(),
      designation: formData.designation.trim(),
      prix_achat: Number(formData.prix_achat) || 0,
      prix_vente: Number(formData.prix_vente) || 0,
      tva: Number(formData.tva) || 20,
      colissage: Number(formData.colissage) || 1
    };
    
    console.log('🔍 Données envoyées à Supabase:', sanitizedData);
    onSave(sanitizedData);
  };

  // Mise à jour des champs avec conversion automatique
  const handleChange = (field: keyof ProductFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'code' || field === 'designation' 
        ? value 
        : Number(value) || 0
    }));
    setErrors([]); // Effacer les erreurs lors de la modification
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="fixed inset-0 backdrop-blur-sm bg-black/20 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal content */}
        <div className={cn(
          "relative w-full max-w-2xl transform transition-all",
          "bg-white backdrop-blur-md border border-gray-200 rounded-2xl",
          "shadow-2xl shadow-black/20 supports-[backdrop-filter]:bg-white"
        )}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <Package className="w-6 h-6 text-indigo-600" />
              <h2 className="text-2xl font-semibold text-gray-900">
                {product ? "Modifier le produit" : "Nouveau produit"}
              </h2>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Code et Désignation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Code produit *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => handleChange("code", e.target.value)}
                  className={cn(
                    "w-full px-4 py-3 rounded-lg border transition-all duration-200",
                    "bg-gray-50 text-gray-900 placeholder-gray-500",
                    "focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  )}
                  placeholder="Ex: 4052199274621"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix d'achat HT * (€)
                </label>
                <input
                  type="number"
                  step="0.0001"
                  min="0.0001"
                  value={formData.prix_achat || ""}
                  onChange={(e) => handleChange("prix_achat", e.target.value)}
                  className={cn(
                    "w-full px-4 py-3 rounded-lg border transition-all duration-200",
                    "bg-gray-50 text-gray-900 placeholder-gray-500",
                    "focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  )}
                  placeholder="0,0000"
                  required
                />
              </div>
            </div>

            {/* Désignation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Désignation *
              </label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => handleChange("designation", e.target.value)}
                className={cn(
                  "w-full px-4 py-3 rounded-lg border transition-all duration-200",
                  "bg-gray-50 text-gray-900 placeholder-gray-500",
                  "focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                )}
                placeholder="Ex: MoliCare Premium Fixpants Long Leg B3 - S"
                required
              />
            </div>

            {/* Prix vente, TVA et Colissage */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix vente HT * (€)
                </label>
                <input
                  type="number"
                  step="0.0001"
                  min="0.0001"
                  value={formData.prix_vente || ""}
                  onChange={(e) => handleChange("prix_vente", e.target.value)}
                  className={cn(
                    "w-full px-4 py-3 rounded-lg border transition-all duration-200",
                    "bg-gray-50 text-gray-900",
                    "focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  )}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  TVA (%) *
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.tva || ""}
                  onChange={(e) => handleChange("tva", e.target.value)}
                  className={cn(
                    "w-full px-4 py-3 rounded-lg border transition-all duration-200",
                    "bg-gray-50 text-gray-900",
                    "focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  )}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Colissage *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.colissage || ""}
                  onChange={(e) => handleChange("colissage", e.target.value)}
                  className={cn(
                    "w-full px-4 py-3 rounded-lg border transition-all duration-200",
                    "bg-gray-50 text-gray-900",
                    "focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  )}
                  required
                />
              </div>
            </div>

            {/* Prévisualisation marge */}
            {formData.prix_achat > 0 && formData.prix_vente > 0 && (
              <div className={cn(
                "p-4 rounded-lg border",
                "bg-indigo-50 border-indigo-200"
              )}>
                <h4 className="font-medium text-indigo-900 mb-2">Calculs automatiques</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-indigo-700">Marge euros:</span>
                    <div className="font-semibold text-indigo-900">
                      {(formData.prix_vente - formData.prix_achat).toFixed(4)}€
                    </div>
                  </div>
                  <div>
                    <span className="text-indigo-700">Marge %:</span>
                    <div className="font-semibold text-indigo-900">
                      {(((formData.prix_vente - formData.prix_achat) / formData.prix_achat) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Erreurs */}
            {errors.length > 0 && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                <ul className="text-sm text-red-700 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className={cn(
                  "flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200",
                  "bg-indigo-600 hover:bg-indigo-700 text-white",
                  "shadow-lg shadow-indigo-600/25 hover:shadow-xl hover:shadow-indigo-600/30",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {loading ? "Enregistrement..." : product ? "Modifier" : "Créer le produit"}
              </button>
              
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className={cn(
                  "px-6 py-3 rounded-lg font-medium transition-all duration-200",
                  "bg-gray-100 hover:bg-gray-200 border text-gray-700",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}