"use client";

import { useState } from "react";
import { X, User, Mail, Phone, Shield } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { User as UserType } from "@/types";
import { UsersService } from "@/lib/services/users.service";

interface EditUserModalProps {
  user: UserType;
  onClose: () => void;
  onUserUpdated: () => void;
}

/**
 * Modal d'édition d'un utilisateur existant
 */
export function EditUserModal({ user, onClose, onUserUpdated }: EditUserModalProps) {
  const [formData, setFormData] = useState({
    email: user.email,
    nom: user.nom,
    prenom: user.prenom || "",
    role: user.role,
    telephone: user.telephone || "",
    actif: user.actif
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<typeof formData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<typeof formData> = {};

    if (!formData.email) {
      newErrors.email = "L'email est obligatoire";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom est obligatoire";
    }

    if (formData.telephone && !/^[\d\s\-\+\(\)]+$/.test(formData.telephone)) {
      newErrors.telephone = "Format de téléphone invalide";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      await UsersService.updateUser(user.id, {
        email: formData.email,
        nom: formData.nom,
        prenom: formData.prenom || undefined,
        role: formData.role,
        telephone: formData.telephone || undefined,
        actif: formData.actif
      });

      console.log("✅ Utilisateur modifié:", formData.email);
      onUserUpdated();
    } catch (error) {
      console.error("❌ Erreur modification utilisateur:", error);
      setErrors({ 
        email: error instanceof Error ? error.message : "Erreur lors de la modification" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Effacer l'erreur du champ modifié
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="fixed inset-0 z-[999999] overflow-y-auto">
      {/* Backdrop gris sur toute la page */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* Container centré */}
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Modal */}
        <div className={cn(
          "relative w-full max-w-md rounded-xl border border-white/20",
          "bg-white backdrop-blur-lg shadow-2xl z-10",
          "transform transition-all duration-300"
        )}>
        {/* En-tête */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
          <div className="flex items-center space-x-3">
            <div className={cn(
              "p-2 rounded-lg",
              "bg-gradient-to-br from-green-500/20 to-blue-500/20",
              "border border-green-500/30"
            )}>
              <User className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Modifier l'utilisateur
            </h2>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100/50 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={cn(
                  "w-full pl-10 pr-4 py-3 rounded-lg",
                  "bg-white/60 backdrop-blur-sm border",
                  errors.email ? "border-red-500/50" : "border-gray-200/50",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                )}
                placeholder="utilisateur@exemple.fr"
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Nom et Prénom */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom *
              </label>
              <input
                type="text"
                value={formData.nom}
                onChange={(e) => handleInputChange('nom', e.target.value)}
                className={cn(
                  "w-full px-4 py-3 rounded-lg",
                  "bg-white/60 backdrop-blur-sm border",
                  errors.nom ? "border-red-500/50" : "border-gray-200/50",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                )}
                placeholder="Nom"
              />
              {errors.nom && (
                <p className="text-sm text-red-600 mt-1">{errors.nom}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prénom
              </label>
              <input
                type="text"
                value={formData.prenom}
                onChange={(e) => handleInputChange('prenom', e.target.value)}
                className={cn(
                  "w-full px-4 py-3 rounded-lg",
                  "bg-white/60 backdrop-blur-sm border border-gray-200/50",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                )}
                placeholder="Prénom"
              />
            </div>
          </div>

          {/* Rôle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rôle *
            </label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value as any)}
                className={cn(
                  "w-full pl-10 pr-4 py-3 rounded-lg appearance-none",
                  "bg-white/60 backdrop-blur-sm border border-gray-200/50",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                )}
              >
                <option value="assistant">Assistant</option>
                <option value="pharmacien">Pharmacien</option>
                <option value="admin">Administrateur</option>
              </select>
            </div>
          </div>

          {/* Téléphone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Téléphone
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="tel"
                value={formData.telephone}
                onChange={(e) => handleInputChange('telephone', e.target.value)}
                className={cn(
                  "w-full pl-10 pr-4 py-3 rounded-lg",
                  "bg-white/60 backdrop-blur-sm border",
                  errors.telephone ? "border-red-500/50" : "border-gray-200/50",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                )}
                placeholder="04 95 46 00 00"
              />
            </div>
            {errors.telephone && (
              <p className="text-sm text-red-600 mt-1">{errors.telephone}</p>
            )}
          </div>

          {/* Statut actif */}
          <div>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.actif}
                onChange={(e) => handleInputChange('actif', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Compte actif
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={cn(
                "px-4 py-2 rounded-lg font-medium transition-all duration-200",
                "bg-gray-100/50 hover:bg-gray-200/50 border border-gray-200/50",
                "text-gray-700 hover:text-gray-800"
              )}
            >
              Annuler
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className={cn(
                "px-6 py-2 rounded-lg font-medium transition-all duration-200",
                "bg-gradient-to-r from-green-600 to-blue-600 text-white",
                "hover:from-green-700 hover:to-blue-700",
                "shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {loading ? "Modification..." : "Modifier l'utilisateur"}
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
}