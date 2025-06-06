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
  onChange: (field: keyof ProductFormData, value: string | number) => void;  // ✅ Type strict
}

/**
 * Champs formulaire avec types stricts
 */
export function ProductFormFields({
  formData,
  errors,
  onChange
}: ProductFormFieldsProps) {

  const hasError = (field: string) => 
    errors.some(error => error.toLowerCase().includes(field.toLowerCase()));

  const getFieldStyle = (field: string) => cn(
    "w-full px-4 py-3 rounded-lg border transition-all duration-200",
    "bg-gray-50 text-gray-900 placeholder-gray-500",
    "focus:outline-none focus:ring-2 focus:ring-indigo-500/50",
    hasError(field) ? "border-red-500" : "border-gray-200 focus:border-indigo-500/50"
  );

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Code produit *
          </label>
          <input
            type="text"
            value={formData.code}
            onChange={(e) => onChange("code", e.target.value)}
            className={getFieldStyle("code")}
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
            onChange={(e) => onChange("prix_achat", e.target.value)}
            className={getFieldStyle("prix")}
            placeholder="0,0000"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Désignation *
        </label>
        <input
          type="text"
          value={formData.designation}
          onChange={(e) => onChange("designation", e.target.value)}
          className={getFieldStyle("désignation")}
          placeholder="Ex: MoliCare Premium Fixpants Long Leg B3 - S"
          required
        />
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
    </>
  );
}