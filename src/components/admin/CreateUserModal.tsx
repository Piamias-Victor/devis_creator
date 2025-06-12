"use client";

import { useState } from "react";
import { X, User as UserIcon, Mail, Phone, Shield, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { User, UserCreateInput } from "@/types";
import { UsersService, CreateUserRequest } from "@/lib/services/users.service";

interface CreateUserModalProps {
  onClose: () => void;
  onUserCreated: (user: User) => void;
}

/**
 * Modal de création d'un nouvel utilisateur
 * Formulaire complet avec validation
 */
export function CreateUserModal({ onClose, onUserCreated }: CreateUserModalProps) {
  const [formData, setFormData] = useState<UserCreateInput & { password: string }>({
    email: "",
    nom: "",
    prenom: "",
    role: "assistant",
    telephone: "",
    password: ""
  });
  
  const [showPassword, setShowPassword] = useState(false);
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

    if (!formData.password) {
      newErrors.password = "Le mot de passe est obligatoire";
    } else if (formData.password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères";
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
      const createRequest: CreateUserRequest = {
        email: formData.email,
        nom: formData.nom,
        prenom: formData.prenom || undefined,
        role: formData.role,
        telephone: formData.telephone || undefined,
        password: formData.password
      };

      const newUser = await UsersService.createUser(createRequest);
      onUserCreated(newUser);
    } catch (error) {
      console.error("Erreur création utilisateur:", error);
      setErrors({ 
        email: error instanceof Error ? error.message : "Erreur lors de la création" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="fixed inset-0 z-[999999] overflow-y-auto">
      {/* Backdrop gris sur toute la page */}
      <div className="fixed inset-0 backdrop-blur-sm" onClick={onClose} />
      
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
              "bg-gradient-to-br from-blue-500/20 to-purple-500/20",
              "border border-blue-500/30"
            )}>
              <UserIcon className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Créer un utilisateur
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

          {/* Mot de passe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={cn(
                  "w-full pl-4 pr-12 py-3 rounded-lg",
                  "bg-white/60 backdrop-blur-sm border",
                  errors.password ? "border-red-500/50" : "border-gray-200/50",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                )}
                placeholder="Mot de passe sécurisé"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600 mt-1">{errors.password}</p>
            )}
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
                "bg-gradient-to-r from-blue-600 to-purple-600 text-white",
                "hover:from-blue-700 hover:to-purple-700",
                "shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {loading ? "Création..." : "Créer l'utilisateur"}
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
}