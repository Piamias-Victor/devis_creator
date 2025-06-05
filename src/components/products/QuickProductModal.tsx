"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils/cn";
import { X, Zap, Package } from "lucide-react";
import { Product, ProductCreateInput, ProductUtils } from "@/types/product";
import { ProductStorageCRUD } from "@/lib/storage/productStorageCRUD";
import { PRODUCT_DEFAULTS } from "@/data/products/simplifiedProducts";

interface QuickProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductCreated: (product: Product) => void;
  suggestedCode: string;
}

/**
 * Modal de création RAPIDE de produit dans le contexte devis
 * Formulaire simplifié avec code pré-rempli
 * Création + ajout automatique au devis
 */
export function QuickProductModal({
  isOpen,
  onClose,
  onProductCreated,
  suggestedCode
}: QuickProductModalProps) {
  const [formData, setFormData] = useState<ProductCreateInput>({
    code: "",
    designation: "",
    prixAchat: 0,
    tva: PRODUCT_DEFAULTS.tva,
    colissage: PRODUCT_DEFAULTS.colissage
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Initialiser avec le code suggéré
  useEffect(() => {
    if (isOpen && suggestedCode) {
      setFormData(prev => ({
        ...prev,
        code: suggestedCode,
        designation: "" // Laisser vide pour que l'utilisateur remplisse
      }));
      setErrors([]);
    }
  }, [isOpen, suggestedCode]);

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

  // Calculs en temps réel
  const prixVenteCalcule = ProductUtils.calculatePrixVente(formData.prixAchat);
  const margeCalculee = ProductUtils.calculateMargePercent(prixVenteCalcule, formData.prixAchat);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const validationErrors = ProductUtils.validateProduct(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setLoading(true);
    setErrors([]);
    
    try {
      // Créer le produit
      const newProduct = ProductStorageCRUD.addProduct(formData);
      
      // Notifier le parent (ajout automatique au devis)
      onProductCreated(newProduct);
      
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur inconnue";
      setErrors([message]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof ProductCreateInput, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors([]); // Effacer les erreurs lors de la modification
  };

  if (!isOpen) return null;

  // Rendu avec portal pour s'afficher au niveau body
  return createPortal(
    <div className="fixed inset-0 z-[999999] overflow-y-auto">
      {/* Overlay de fond */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="fixed inset-0 backdrop-blur-sm bg-black/40 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal content - CENTRÉ ET VISIBLE */}
        <div className={cn(
          "relative w-full max-w-lg transform transition-all z-10",
          "bg-white backdrop-blur-md border border-orange-200 rounded-2xl",
          "shadow-2xl shadow-orange-500/20 supports-[backdrop-filter]:bg-white/95",
          "mx-auto my-8" // AJOUT: marges pour centrage parfait
        )}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-orange-100 bg-orange-50 rounded-t-2xl">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-orange-200">
                <Zap className="w-5 h-5 text-orange-700" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-orange-900">
                  Création rapide
                </h2>
                <p className="text-sm text-orange-700">
                  Produit créé et ajouté automatiquement au devis
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-orange-100 text-orange-600 hover:text-orange-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Body avec scroll si nécessaire */}
          <div className="max-h-[70vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Code (pré-rempli, non modifiable) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Code produit
                </label>
                <input
                  type="text"
                  value={formData.code}
                  readOnly
                  className={cn(
                    "w-full px-4 py-3 rounded-lg border transition-all duration-200",
                    "bg-gray-100 text-gray-700 font-mono text-lg",
                    "border-gray-300 cursor-not-allowed"
                  )}
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
                  className={cn(
                    "w-full px-4 py-3 rounded-lg border transition-all duration-200",
                    "bg-gray-50 text-gray-900 placeholder-gray-500",
                    "focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500"
                  )}
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
                    min="0"
                    value={formData.prixAchat || ""}
                    onChange={(e) => handleChange("prixAchat", parseFloat(e.target.value) || 0)}
                    className={cn(
                      "w-full px-4 py-3 rounded-lg border transition-all duration-200",
                      "bg-gray-50 text-gray-900 placeholder-gray-500",
                      "focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500"
                    )}
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
                    className={cn(
                      "w-full px-4 py-3 rounded-lg border transition-all duration-200",
                      "bg-gray-50 text-gray-900",
                      "focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500"
                    )}
                  />
                </div>
              </div>

              {/* TVA (pré-remplie) */}
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
                  className={cn(
                    "w-full px-4 py-3 rounded-lg border transition-all duration-200",
                    "bg-gray-50 text-gray-900",
                    "focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500"
                  )}
                />
              </div>

              {/* Prévisualisation AMÉLIORÉE */}
              {formData.prixAchat > 0 && (
                <div className={cn(
                  "p-4 rounded-lg border-2 border-dashed",
                  "bg-green-50 border-green-300"
                )}>
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
    </div>,
    document.body // RENDU DANS LE BODY
  );
}