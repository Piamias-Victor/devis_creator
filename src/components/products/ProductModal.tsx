"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils/cn";
import { X, Package } from "lucide-react";
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
  onSave: (product: ProductFormData) => void;  // ✅ Type corrigé
  product?: any | null;
  loading?: boolean;
}

/**
 * Modal de produit avec types corrigés
 * Container léger < 50 lignes
 */
export function ProductModal({
  isOpen,
  onClose,
  onSave,
  product,
  loading
}: ProductModalProps) {
  const { handleKeyboardClose } = useProductModal({ isOpen, onClose });

  useEffect(() => {
    handleKeyboardClose();
  }, [handleKeyboardClose]);

  if (!isOpen) return null;

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
          "shadow-2xl shadow-black/20 supports-[backdrop-filter]:bg-white"
        )}>
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
          
          <div className="p-6">
            <ProductForm
              product={product}
              onSubmit={onSave}  // ✅ Types maintenant compatibles
              onCancel={onClose}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}