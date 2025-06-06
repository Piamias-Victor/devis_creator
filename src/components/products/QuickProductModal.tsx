"use client";

import { createPortal } from "react-dom";
import { cn } from "@/lib/utils/cn";
import { X, Zap } from "lucide-react";
import { Product } from "@/types";
import { useQuickProduct } from "./hooks/useQuickProduct";
import { QuickProductForm } from "./forms/QuickProductForm";


interface QuickProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductCreated: (product: Product) => void;
  suggestedCode: string;
}

/**
 * Modal création rapide REFACTORISÉE
 * Container léger < 50 lignes
 */
export function QuickProductModal({
  isOpen,
  onClose,
  onProductCreated,
  suggestedCode
}: QuickProductModalProps) {
  
  const { handleProductCreation, loading, errors } = useQuickProduct({
    isOpen,
    onClose,
    onProductCreated,
    suggestedCode
  });

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[999999] overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="fixed inset-0 backdrop-blur-sm bg-black/40 transition-opacity"
          onClick={onClose}
        />
        
        <div className={cn(
          "relative w-full max-w-lg transform transition-all z-10",
          "bg-white backdrop-blur-md border border-orange-200 rounded-2xl",
          "shadow-2xl shadow-orange-500/20 supports-[backdrop-filter]:bg-white/95",
          "mx-auto my-8"
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
          
          {/* Body - Délégué au formulaire */}
          <div className="max-h-[70vh] overflow-y-auto">
            <QuickProductForm
              suggestedCode={suggestedCode}
              onSubmit={handleProductCreation}
              onCancel={onClose}
              loading={loading}
              errors={errors}
            />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}