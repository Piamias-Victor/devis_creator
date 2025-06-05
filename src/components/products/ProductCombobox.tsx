"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils/cn";
// CORRECTION: Utiliser useProductsCRUD au lieu de useProducts
import { useProductsCRUD } from "@/lib/hooks/useProductsCRUD";
import { Search, ChevronDown, X, Plus, Zap } from "lucide-react";
import { formatPriceUnit } from "@/lib/utils/calculUtils";
import { QuickProductModal } from "./QuickProductModal";
import { Product } from "@/types";

interface ProductComboboxProps {
  onSelect: (product: Product) => void;
  placeholder?: string;
  className?: string;
}

/**
 * ProductCombobox UNIFIÉ
 * Utilise useProductsCRUD pour cohérence avec page /products
 * Une seule logique de recherche dans toute l'app !
 */
export function ProductCombobox({ 
  onSelect, 
  placeholder = "Rechercher un produit (ex: Molicare 8G XL)...",
  className 
}: ProductComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showQuickCreate, setShowQuickCreate] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // CORRECTION: Utiliser useProductsCRUD qui a la recherche intelligente
  const { 
    products, 
    loading, 
    searchQuery, 
    setSearchQuery 
  } = useProductsCRUD();

  // Fermer dropdown au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Détecter si la saisie ressemble à un code produit inexistant
  const isCodeLike = (text: string): boolean => {
    const trimmed = text.trim();
    return trimmed.length > 3 && 
           !trimmed.includes(' ') && 
           /[0-9\-_]/.test(trimmed);
  };

  const queryLooksLikeCode = isCodeLike(searchQuery);
  const exactProduct = products.find(p => p.code === searchQuery.trim());
  const shouldShowCreateOption = queryLooksLikeCode && !exactProduct && products.length === 0;

  // Gestion de la sélection
  const handleSelect = (product: Product) => {
    console.log("✅ Produit sélectionné:", product.designation);
    onSelect(product);
    setSearchQuery(""); // Effacer la recherche
    setIsOpen(false);
  };

  // Créer un produit à la volée
  const handleQuickCreate = () => {
    setShowQuickCreate(true);
    setIsOpen(false);
  };

  // Produit créé via modal rapide
  const handleProductCreated = (product: Product) => {
    setShowQuickCreate(false);
    setSearchQuery("");
    onSelect(product);
  };

  // Effacer la recherche
  const handleClear = () => {
    setSearchQuery("");
    setIsOpen(false);
    inputRef.current?.focus();
  };

  // Gestion Enter pour code inexistant
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && shouldShowCreateOption) {
      e.preventDefault();
      handleQuickCreate();
    }
  };

  // Mise à jour de la recherche en temps réel
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setIsOpen(true);
    
    // DEBUG
    if (value.toLowerCase().includes("molicare")) {
      console.log(`🔍 ProductCombobox (useProductsCRUD) recherche: "${value}"`);
    }
  };

  return (
    <>
      <div className={cn("relative w-full", className)} ref={dropdownRef}>
        {/* Input de recherche */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-gray-500" />
          </div>
          
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={cn(
              "w-full pl-10 pr-10 py-3 rounded-lg transition-all duration-200",
              "bg-gray-100 backdrop-blur-sm border border-gray-200",
              "text-gray-900 dark:text-gray-100 placeholder-gray-500",
              "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50",
              shouldShowCreateOption && "border-orange-300 ring-1 ring-orange-500/20"
            )}
          />
          
          <div className="absolute inset-y-0 right-0 flex items-center">
            {searchQuery && (
              <button
                onClick={handleClear}
                className="p-1 mr-1 text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <ChevronDown className={cn(
                "w-4 h-4 transition-transform duration-200",
                isOpen && "rotate-180"
              )} />
            </button>
          </div>
        </div>

        {/* Dropdown avec z-index maximum */}
        {isOpen && (
          <div className={cn(
            "absolute top-full left-0 right-0 mt-2",
            "z-[999999]",
            "bg-white backdrop-blur-md border border-gray-200 rounded-xl",
            "shadow-2xl shadow-black/20 max-h-96 overflow-hidden"
          )}>
            {loading ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Recherche...</p>
              </div>
            ) : (
              <>
                {/* Option création rapide */}
                {shouldShowCreateOption && (
                  <div className="p-2 border-b border-orange-100 bg-orange-50">
                    <button
                      onClick={handleQuickCreate}
                      className="w-full p-3 rounded-lg bg-orange-100 hover:bg-orange-200 border border-orange-300 text-orange-800 font-medium"
                    >
                      <div className="flex items-center space-x-2">
                        <Zap className="w-4 h-4" />
                        <span>Créer "{searchQuery.trim()}"</span>
                      </div>
                    </button>
                  </div>
                )}

                {/* Résultats */}
                {products.length === 0 && !shouldShowCreateOption ? (
                  <div className="p-6 text-center">
                    <p className="text-gray-600">
                      {searchQuery ? `Aucun résultat pour "${searchQuery}"` : "Tapez pour rechercher"}
                    </p>
                  </div>
                ) : products.length > 0 ? (
                  <div className="max-h-80 overflow-y-auto">
                    <div className="p-2 space-y-1">
                      {products.slice(0, 8).map((product) => (
                        <div
                          key={product.code}
                          onClick={() => handleSelect(product as any)}
                          className="p-3 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {product.designation}
                              </p>
                              <div className="flex items-center space-x-3 mt-1 text-xs text-gray-600">
                                <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">
                                  {product.code}
                                </span>
                                <span>•</span>
                                <span className="font-semibold text-green-600">
                                  {formatPriceUnit(product.prixVente || 0)}
                                </span>
                                <span>•</span>
                                <span>x{product.colissage}</span>
                              </div>
                            </div>
                            <Plus className="w-4 h-4 text-blue-600 ml-2 flex-shrink-0" />
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {products.length > 8 && (
                      <div className="p-3 border-t border-gray-100 text-center">
                        <p className="text-sm text-gray-600">
                          {products.length - 8} produit{products.length - 8 > 1 ? 's' : ''} supplémentaire{products.length - 8 > 1 ? 's' : ''}...
                        </p>
                      </div>
                    )}
                  </div>
                ) : null}
              </>
            )}
          </div>
        )}
      </div>

      {/* Modal création rapide */}
      <QuickProductModal
        isOpen={showQuickCreate}
        onClose={() => setShowQuickCreate(false)}
        onProductCreated={handleProductCreated as any}
        suggestedCode={searchQuery.trim()}
      />
    </>
  );
}