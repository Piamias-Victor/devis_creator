"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils/cn";
import { Product } from "@/types";
import { useProducts } from "@/lib/hooks/useProducts";
import { ProductCard } from "./ProductCard";
import { Search, ChevronDown, X } from "lucide-react";

interface ProductComboboxProps {
  onSelect: (product: Product) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Combobox de recherche produits avec autocomplete
 * Dropdown glassmorphism avec recherche temps réel
 */
export function ProductCombobox({ 
  onSelect, 
  placeholder = "Rechercher un produit...",
  className 
}: ProductComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { products, loading, setSearchQuery } = useProducts();

  // Mise à jour de la recherche avec debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(query);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [query, setSearchQuery]);

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

  // Gestion de la sélection
  const handleSelect = (product: Product) => {
    onSelect(product);
    setQuery("");
    setSearchQuery("");
    setIsOpen(false);
  };

  // Effacer la recherche
  const handleClear = () => {
    setQuery("");
    setSearchQuery("");
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className={cn("relative w-full", className)} ref={dropdownRef}>
      {/* Input de recherche */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-gray-500" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={cn(
            "w-full pl-10 pr-10 py-3 rounded-lg transition-all duration-200",
            "bg-gray-100 backdrop-blur-sm border border-gray-200",
            "text-gray-900 dark:text-gray-100 placeholder-gray-500",
            "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
          )}
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center">
          {query && (
            <button
              onClick={handleClear}
              className="p-1 mr-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <ChevronDown className={cn(
              "w-4 h-4 transition-transform duration-200",
              isOpen && "rotate-180"
            )} />
          </button>
        </div>
      </div>

      {/* Dropdown des résultats */}
      {isOpen && (
        <div className={cn(
          "absolute top-full left-0 right-0 mt-2 z-50",
          "bg-gray-100 backdrop-blur-md border border-gray-200 rounded-xl",
          "shadow-2xl shadow-black/20 max-h-96 overflow-hidden",
          "supports-[backdrop-filter]:bg-gray-100"
        )}>
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Recherche...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                {query ? "Aucun produit trouvé" : "Tapez pour rechercher"}
              </p>
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              <div className="p-2 space-y-1">
                {products.slice(0, 8).map((product) => (
                  <ProductCard
                    key={product.code}
                    product={product}
                    onSelect={handleSelect}
                    compact
                  />
                ))}
              </div>
              
              {products.length > 8 && (
                <div className="p-3 border-t border-gray100 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {products.length - 8} produit{products.length - 8 > 1 ? 's' : ''} supplémentaire{products.length - 8 > 1 ? 's' : ''}...
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}