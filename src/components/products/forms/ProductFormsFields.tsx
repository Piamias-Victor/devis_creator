"use client";

import { cn } from "@/lib/utils/cn";

// ✅ Interface exacte pour les champs
interface ProductFormData {
  code: string;
  designation: string;
  prix_achat: number;
  prix_vente: number;
  tva: number;
  colissage: number;
}

interface ProductFormFieldsProps {
  formData: ProductFormData;
  errors: string[];
  onChange: (field: keyof ProductFormData, value: string | number) => void;
  isDuplicating?: boolean; // ✅ NOUVELLE PROP optionnelle
}

/**
 * Champs formulaire AVEC indicateurs visuels duplication
 * Mise en évidence des champs critiques à modifier
 */
export function ProductFormFields({
  formData,
  errors,
  onChange,
  isDuplicating = false // ✅ NOUVELLE PROP avec défaut
}: ProductFormFieldsProps) {

  const hasError = (field: string) => 
    errors.some(error => error.toLowerCase().includes(field.toLowerCase()));

  // ✅ Style adapté selon mode duplication
  const getFieldStyle = (field: string, isHighlighted = false) => cn(
    "w-full px-4 py-3 rounded-lg border transition-all duration-200",
    "bg-gray-50 text-gray-900 placeholder-gray-500",
    "focus:outline-none focus:ring-2 focus:ring-indigo-500/50",
    // Erreurs
    hasError(field) ? "border-red-500" : "border-gray-200 focus:border-indigo-500/50",
    // ✅ Highlight spécial en mode duplication
    isDuplicating && isHighlighted && [
      "border-green-400 bg-green-50 ring-2 ring-green-500/20",
      "focus:ring-green-500/50 focus:border-green-500"
    ]
  );

  // ✅ Détecter si le champ nécessite attention en duplication
  const needsAttentionInDuplication = (field: string) => {
    if (!isDuplicating) return false;
    
    switch (field) {
      case 'code':
        return formData.code.includes('_COPY') || formData.code.includes('COPY');
      case 'designation':
        return formData.designation.includes('COPIE') || formData.designation.includes('COPY');
      default:
        return false;
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={cn(
            "block text-sm font-medium mb-2",
            isDuplicating && needsAttentionInDuplication('code') 
              ? "text-green-700" 
              : "text-gray-700"
          )}>
            Code produit * 
            {/* ✅ Indicateur attention en duplication */}
            {isDuplicating && needsAttentionInDuplication('code') && (
              <span className="ml-2 text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full">
                ⚠️ À modifier
              </span>
            )}
          </label>
          <input
            type="text"
            value={formData.code}
            onChange={(e) => onChange("code", e.target.value)}
            className={getFieldStyle("code", needsAttentionInDuplication('code'))}
            placeholder="Ex: 4052199274621"
            required
            autoFocus={isDuplicating} // ✅ Focus automatique en duplication
          />
          {/* ✅ Aide contextuelle en duplication */}
          {isDuplicating && needsAttentionInDuplication('code') && (
            <p className="mt-1 text-xs text-green-600">
              💡 Modifiez ce code pour éviter les conflits avec l'original
            </p>
          )}
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
            onChange={(e) => onChange("prix_achat", e.target.value)}
            className={getFieldStyle("prix")}
            placeholder="0,0000"
            required
          />
        </div>
      </div>

      <div>
        <label className={cn(
          "block text-sm font-medium mb-2",
          isDuplicating && needsAttentionInDuplication('designation') 
            ? "text-green-700" 
            : "text-gray-700"
        )}>
          Désignation *
          {/* ✅ Indicateur attention en duplication */}
          {isDuplicating && needsAttentionInDuplication('designation') && (
            <span className="ml-2 text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full">
              ⚠️ À personnaliser
            </span>
          )}
        </label>
        <input
          type="text"
          value={formData.designation}
          onChange={(e) => onChange("designation", e.target.value)}
          className={getFieldStyle("désignation", needsAttentionInDuplication('designation'))}
          placeholder="Ex: MoliCare Premium Fixpants Long Leg B3 - S"
          required
        />
        {/* ✅ Aide contextuelle en duplication */}
        {isDuplicating && needsAttentionInDuplication('designation') && (
          <p className="mt-1 text-xs text-green-600">
            💡 Personnalisez la désignation pour différencier de l'original
          </p>
        )}
      </div>

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
            onChange={(e) => onChange("prix_vente", e.target.value)}
            className={getFieldStyle("prix")}
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
            onChange={(e) => onChange("tva", e.target.value)}
            className={getFieldStyle("tva")}
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
            onChange={(e) => onChange("colissage", e.target.value)}
            className={getFieldStyle("colissage")}
            required
          />
        </div>
      </div>

      {/* ✅ Info duplication en bas */}
      {isDuplicating && (
        <div className="text-xs text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
          <strong>Mode duplication :</strong> Les prix et paramètres techniques ont été copiés depuis l'original. 
          Seuls le code et la désignation nécessitent généralement une modification.
        </div>
      )}
    </>
  );
}