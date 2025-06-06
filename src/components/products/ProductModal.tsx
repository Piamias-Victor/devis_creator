"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils/cn";
import { X, Package, Copy } from "lucide-react";
import { useProductModal } from "./hooks/useProductModal";
import { ProductForm } from "./forms/ProductForms";

// ✅ Interface locale corrigée pour Supabase
interface ProductFormData {
  code: string;
  designation: string;
  prix_achat: number;
  prix_vente: number;
  tva: number;
  colissage: number;
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: ProductFormData) => void;
  product?: any | null;
  loading?: boolean;
  isDuplicating?: boolean; // ✅ NOUVELLE PROP optionnelle
}

/**
 * Modal de produit AVEC support duplication
 * Affichage titre et icône adaptés selon mode
 */
export function ProductModal({
  isOpen,
  onClose,
  onSave,
  product,
  loading,
  isDuplicating = false // ✅ NOUVELLE PROP avec défaut
}: ProductModalProps) {
  const { handleKeyboardClose } = useProductModal({ isOpen, onClose });

  useEffect(() => {
    handleKeyboardClose();
  }, [handleKeyboardClose]);

  if (!isOpen) return null;

  // ✅ Logique d'affichage selon le mode
  const getModalTitle = () => {
    if (isDuplicating) return "Dupliquer le produit";
    if (product) return "Modifier le produit";
    return "Nouveau produit";
  };

  const getModalIcon = () => {
    if (isDuplicating) return Copy;
    return Package;
  };

  const getModalIconColor = () => {
    if (isDuplicating) return "text-green-600";
    return "text-indigo-600";
  };

  const ModalIcon = getModalIcon();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="fixed inset-0 backdrop-blur-sm bg-black/20 transition-opacity"
          onClick={onClose}
        />
        
        <div className={cn(
          "relative w-full max-w-2xl transform transition-all",
          "bg-white backdrop-blur-md border border-gray-200 rounded-2xl",
          "shadow-2xl shadow-black/20 supports-[backdrop-filter]:bg-white",
          // ✅ Bordure spéciale en mode duplication
          isDuplicating && "border-green-300 shadow-green-500/20"
        )}>
          <div className={cn(
            "flex items-center justify-between p-6 border-b border-gray-100",
            // ✅ Background spécial en mode duplication
            isDuplicating && "bg-green-50 border-green-200"
          )}>
            <div className="flex items-center space-x-3">
              <ModalIcon className={cn("w-6 h-6", getModalIconColor())} />
              <div>
                <h2 className={cn(
                  "text-2xl font-semibold",
                  isDuplicating ? "text-green-900" : "text-gray-900"
                )}>
                  {getModalTitle()}
                </h2>
                {/* ✅ Sous-titre informatif en mode duplication */}
                {isDuplicating && (
                  <p className="text-sm text-green-700 mt-1">
                    📋 Données copiées - modifiez le code et les détails si nécessaire
                  </p>
                )}
              </div>
            </div>
            
            <button
              onClick={onClose}
              className={cn(
                "p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700",
                isDuplicating && "hover:bg-green-100 text-green-600 hover:text-green-800"
              )}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6">
            <ProductForm
              product={product}
              onSubmit={onSave}
              onCancel={onClose}
              loading={loading}
              isDuplicating={isDuplicating} // ✅ Passer le flag au formulaire
            />
          </div>
        </div>
      </div>
    </div>
  );
}