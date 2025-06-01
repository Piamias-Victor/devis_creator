"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { FileText, Lock, Mail, Eye, EyeOff } from "lucide-react";

/**
 * Page de connexion avec glassmorphism
 * Formulaire email/password + comptes de démonstration
 */
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Connexion
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email ou mot de passe incorrect");
      } else {
        // Redirection après connexion réussie
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  // Connexion rapide demo
  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setLoading(true);
    
    try {
      const result = await signIn("credentials", {
        email: demoEmail,
        password: demoPassword,
        redirect: false,
      });

      if (!result?.error) {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      setError("Erreur de connexion demo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className={cn(
        "w-full max-w-md space-y-8",
        "bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8",
        "shadow-2xl shadow-black/10"
      )}>
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className={cn(
              "p-4 rounded-full",
              "bg-gradient-to-br from-blue-500/20 to-purple-600/20",
              "border border-white/30"
            )}>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Créateur de Devis
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Connectez-vous pour accéder à l'application
          </p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-gray-500" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={cn(
                  "w-full pl-10 pr-4 py-3 rounded-lg",
                  "bg-white/20 backdrop-blur-sm border border-white/30",
                  "text-gray-900 dark:text-gray-100 placeholder-gray-500",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                )}
                placeholder="admin@pharmacie-corte.fr"
              />
            </div>
          </div>

          {/* Mot de passe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-gray-500" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={cn(
                  "w-full pl-10 pr-12 py-3 rounded-lg",
                  "bg-white/20 backdrop-blur-sm border border-white/30",
                  "text-gray-900 dark:text-gray-100 placeholder-gray-500",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                )}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-500" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          {/* Erreur */}
          {error && (
            <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30">
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          {/* Bouton connexion */}
          <button
            type="submit"
            disabled={loading}
            className={cn(
              "w-full py-3 px-6 rounded-lg font-medium",
              "bg-blue-600 hover:bg-blue-700 text-white",
              "shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30",
              "transition-all duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        {/* Comptes de démonstration */}
        <div className="mt-8 pt-6 border-t border-white/20">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
            Comptes de démonstration
          </p>
          
          <div className="space-y-2">
            <button
              onClick={() => handleDemoLogin("admin@pharmacie-corte.fr", "admin123")}
              className={cn(
                "w-full py-2 px-4 rounded-lg text-sm",
                "bg-green-500/20 hover:bg-green-500/30 border border-green-500/30",
                "text-green-700 dark:text-green-300 transition-colors"
              )}
            >
              👑 Admin (admin@pharmacie-corte.fr)
            </button>
            
            <button
              onClick={() => handleDemoLogin("demo@demo.fr", "demo123")}
              className={cn(
                "w-full py-2 px-4 rounded-lg text-sm",
                "bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30",
                "text-purple-700 dark:text-purple-300 transition-colors"
              )}
            >
              🧪 Démo (demo@demo.fr)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}