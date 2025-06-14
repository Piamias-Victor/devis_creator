"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils/cn";
import { ProductPreview } from "./ProductPreview";
import { ProductFormFields } from "./ProductFormsFields";
import { Copy } from "lucide-react";

// ✅ Interface exacte pour Supabase
interface ProductFormData {
  code: string;
  designation: string;
  prix_achat: number;
  prix_vente: number;
  tva: number;
  colissage: number;
}

interface ProductFormProps {
  product?: any | null;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  loading?: boolean;
  isDuplicating?: boolean; // ✅ NOUVELLE PROP
}

/**
 * Formulaire produit AVEC support duplication
 * Pré-remplissage intelligent et validation adaptée
 */
export function ProductForm({
  product,
  onSubmit,
  onCancel,
  loading,
  isDuplicating = false // ✅ NOUVELLE PROP
}: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    code: "",
    designation: "",
    prix_achat: 0,
    prix_vente: 0,
    tva: 20,
    colissage: 1
  });

  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (product) {
      setFormData({
        code: product.code || "",
        designation: product.designation || "",
        prix_achat: Number(product.prixAchat) || 0,
        prix_vente: Number(product.prixVente) || 0,
        tva: Number(product.tva) || 20,
        colissage: Number(product.colissage) || 1
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
  }, [product]);

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!formData.code?.trim()) newErrors.push("Le code produit est obligatoire");
    if (!formData.designation?.trim()) newErrors.push("La désignation est obligatoire");
    
    const prixAchat = Number(formData.prix_achat);
    const prixVente = Number(formData.prix_vente);
    const tva = Number(formData.tva);
    const colissage = Number(formData.colissage);
    
    if (!prixAchat || prixAchat <= 0) newErrors.push("Le prix d'achat doit être supérieur à 0");
    if (!prixVente || prixVente <= 0) newErrors.push("Le prix de vente doit être supérieur à 0");
    if (isNaN(tva) || tva < 0 || tva > 100) newErrors.push("La TVA doit être entre 0 et 100%");
    if (!colissage || colissage < 1) newErrors.push("Le colissage doit être d'au moins 1");

    // ✅ Validation spéciale en mode duplication (éviter conflit code)
    if (isDuplicating && formData.code.endsWith('_COPY')) {
      newErrors.push("⚠️ Modifiez le code produit pour éviter les conflits (retirez '_COPY')");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const sanitizedData: ProductFormData = {
      code: String(formData.code).trim(),
      designation: String(formData.designation).trim(),
      prix_achat: Number(formData.prix_achat),
      prix_vente: Number(formData.prix_vente),
      tva: Number(formData.tva),
      colissage: Number(formData.colissage)
    };
    
    console.log('🔍 Données produit envoyées:', sanitizedData);
    
    if (!sanitizedData.prix_achat || !sanitizedData.prix_vente) {
      setErrors(["Erreur: Prix d'achat et prix de vente obligatoires"]);
      return;
    }
    
    onSubmit(sanitizedData);
  };

  // ✅ Type handler strictement typé
  const handleChange = (field: keyof ProductFormData, value: string | number) => {
    setFormData(prev => {
      const newData = { ...prev };
      
      if (field === 'code' || field === 'designation') {
        newData[field] = String(value);
      } else {
        const numValue = Number(value);
        newData[field] = isNaN(numValue) ? 0 : numValue;
      }
      
      return newData;
    });
    
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  // ✅ Fonction pour nettoyer le code en mode duplication
  const handleCleanDuplicatedCode = () => {
    if (isDuplicating && formData.code.includes('_COPY')) {
      const cleanCode = formData.code.replace('_COPY', '_DUP_' + Date.now().toString().slice(-4));
      handleChange('code', cleanCode);
    }
  };

  // ✅ Fonction pour nettoyer la désignation
  const handleCleanDuplicatedDesignation = () => {
    if (isDuplicating && formData.designation.startsWith('COPIE - ')) {
      const cleanDesignation = formData.designation.replace('COPIE - ', '');
      handleChange('designation', `${cleanDesignation} - Variante`);
    }
  };

  // ✅ Déterminer le texte du bouton selon le mode
  const getSubmitButtonText = () => {
    if (loading) return "Enregistrement...";
    if (isDuplicating) return "Créer la copie";
    if (product) return "Modifier";
    return "Créer le produit";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ✅ Bannière informative en mode duplication */}

      <ProductFormFields
        formData={formData}
        errors={errors}
        onChange={handleChange}
        isDuplicating={isDuplicating} // ✅ Passer le flag aux champs
      />

      <ProductPreview 
        formData={{
          code: formData.code,
          designation: formData.designation,
          prixAchat: formData.prix_achat,
          prixVente: formData.prix_vente,
          tva: formData.tva,
          colissage: formData.colissage
        }} 
      />

      {errors.length > 0 && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200">
          <h4 className="font-medium text-red-800 mb-2">⚠️ Erreurs à corriger :</h4>
          <ul className="text-sm text-red-700 space-y-1">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex space-x-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className={cn(
            "flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200",
            isDuplicating 
              ? "bg-green-600 hover:bg-green-700 shadow-green-600/25 hover:shadow-xl hover:shadow-green-600/30"
              : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/25 hover:shadow-xl hover:shadow-indigo-600/30",
            "text-white disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {getSubmitButtonText()}
        </button>
        
        <button
          type="button"
          onClick={onCancel}
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
  );
}