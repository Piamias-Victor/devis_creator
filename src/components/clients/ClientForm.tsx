"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { Client } from "@/types";

interface ClientFormProps {
  client?: Client;
  onSubmit: (data: Omit<Client, "id" | "createdAt">) => void;
  onCancel: () => void;
  loading?: boolean;
}

interface FormData {
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
  siret: string;
}

/**
 * Formulaire de création/modification client
 * Validation et états de chargement
 */
export function ClientForm({ client, onSubmit, onCancel, loading }: ClientFormProps) {
  const [formData, setFormData] = useState<FormData>({
    nom: client?.nom || "",
    adresse: client?.adresse || "",
    telephone: client?.telephone || "",
    email: client?.email || "",
    siret: client?.siret || "",
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Validation simple
  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.nom.trim()) newErrors.nom = "Le nom est requis";
    if (!formData.adresse.trim()) newErrors.adresse = "L'adresse est requise";
    if (!formData.telephone.trim()) newErrors.telephone = "Le téléphone est requis";
    if (!formData.email.trim()) newErrors.email = "L'email est requis";
    if (!formData.siret.trim()) newErrors.siret = "Le SIRET est requis";
    
    // Validation email simple
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Format email invalide";
    }
    
    // Validation SIRET (14 chiffres)
    const siretRegex = /^\d{14}$/;
    if (formData.siret && !siretRegex.test(formData.siret.replace(/\s/g, ""))) {
      newErrors.siret = "SIRET invalide (14 chiffres)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    onSubmit(formData);
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nom */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Nom / Raison sociale *
        </label>
        <input
          type="text"
          value={formData.nom}
          onChange={(e) => handleChange("nom", e.target.value)}
          className={cn(
            "w-full px-4 py-3 rounded-lg transition-all duration-200",
            "bg-gray-100 backdrop-blur-sm border",
            "text-gray-900 dark:text-gray-100 placeholder-gray-500",
            "focus:outline-none focus:ring-2 focus:ring-blue-500/50",
            errors.nom ? "border-red-500" : "border-gray-200 focus:border-blue-500/50"
          )}
          placeholder="Ex: EHPAD Les Jardins"
        />
        {errors.nom && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.nom}</p>
        )}
      </div>

      {/* Adresse */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Adresse complète *
        </label>
        <textarea
          value={formData.adresse}
          onChange={(e) => handleChange("adresse", e.target.value)}
          rows={3}
          className={cn(
            "w-full px-4 py-3 rounded-lg transition-all duration-200",
            "bg-gray-100 backdrop-blur-sm border",
            "text-gray-900 dark:text-gray-100 placeholder-gray-500",
            "focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none",
            errors.adresse ? "border-red-500" : "border-gray-200 focus:border-blue-500/50"
          )}
          placeholder="Adresse, Code postal, Ville"
        />
        {errors.adresse && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.adresse}</p>
        )}
      </div>

      {/* Téléphone et Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Téléphone *
          </label>
          <input
            type="tel"
            value={formData.telephone}
            onChange={(e) => handleChange("telephone", e.target.value)}
            className={cn(
              "w-full px-4 py-3 rounded-lg transition-all duration-200",
              "bg-gray-100 backdrop-blur-sm border",
              "text-gray-900 dark:text-gray-100 placeholder-gray-500",
              "focus:outline-none focus:ring-2 focus:ring-blue-500/50",
              errors.telephone ? "border-red-500" : "border-gray-200 focus:border-blue-500/50"
            )}
            placeholder="04 95 XX XX XX"
          />
          {errors.telephone && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.telephone}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className={cn(
              "w-full px-4 py-3 rounded-lg transition-all duration-200",
              "bg-gray-100 backdrop-blur-sm border",
              "text-gray-900 dark:text-gray-100 placeholder-gray-500",
              "focus:outline-none focus:ring-2 focus:ring-blue-500/50",
              errors.email ? "border-red-500" : "border-gray-200 focus:border-blue-500/50"
            )}
            placeholder="contact@exemple.fr"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
          )}
        </div>
      </div>

      {/* SIRET */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          SIRET *
        </label>
        <input
          type="text"
          value={formData.siret}
          onChange={(e) => handleChange("siret", e.target.value)}
          className={cn(
            "w-full px-4 py-3 rounded-lg transition-all duration-200",
            "bg-gray-100 backdrop-blur-sm border",
            "text-gray-900 dark:text-gray-100 placeholder-gray-500",
            "focus:outline-none focus:ring-2 focus:ring-blue-500/50",
            errors.siret ? "border-red-500" : "border-gray-200 focus:border-blue-500/50"
          )}
          placeholder="12345678901234"
          maxLength={14}
        />
        {errors.siret && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.siret}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex space-x-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className={cn(
            "flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200",
            "bg-blue-600 hover:bg-blue-700 text-white",
            "shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "hover:-translate-y-0.5"
          )}
        >
          {loading ? "Enregistrement..." : client ? "Modifier" : "Créer le client"}
        </button>
        
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className={cn(
            "px-6 py-3 rounded-lg font-medium transition-all duration-200",
            "bg-gray-100 hover:bg-gray-200 border",
            "backdrop-blur-sm text-gray-700 dark:text-gray-300",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "hover:-translate-y-0.5"
          )}
        >
          Annuler
        </button>
      </div>
    </form>
  );
}