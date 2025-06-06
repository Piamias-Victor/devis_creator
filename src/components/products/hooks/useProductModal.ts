"use client";

import { useEffect, useCallback } from "react";

interface UseProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Hook pour gestion modal produit
 * Logique keyboard + scroll < 40 lignes
 */
export function useProductModal({ isOpen, onClose }: UseProductModalProps) {
  
  // Gestion touches clavier
  const handleKeyboardClose = useCallback(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      return () => document.removeEventListener("keydown", handleEsc);
    }
  }, [isOpen, onClose]);

  // Gestion scroll body
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return {
    handleKeyboardClose
  };
}