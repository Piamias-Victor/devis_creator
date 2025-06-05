"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { Database, Download, Upload, CheckCircle, AlertTriangle, Zap } from "lucide-react";
import { exportLocalStorageData, saveExportToFile } from "@/lib/migration/exportLocalStorage";
import { importToSupabase } from "@/lib/migration/importToSupabase";
import { testConnection } from "@/lib/database/supabase";
import Link from "next/link";

type MigrationStep = 'test' | 'export' | 'import' | 'cleanup' | 'done';

interface MigrationStatus {
  step: MigrationStep;
  loading: boolean;
  error: string | null;
  exportData: any | null;
  logs: string[];
}

/**
 * Interface de migration Big-Bang vers Supabase
 * Processus guidé en 4 étapes
 */
export function MigrationInterface() {
  const [status, setStatus] = useState<MigrationStatus>({
    step: 'test',
    loading: false,
    error: null,
    exportData: null,
    logs: []
  });

  const addLog = (message: string) => {
    setStatus(prev => ({
      ...prev,
      logs: [...prev.logs, `${new Date().toLocaleTimeString()} - ${message}`]
    }));
  };

  // ÉTAPE 1 : Test connexion Supabase
  const handleTestConnection = async () => {
    setStatus(prev => ({ ...prev, loading: true, error: null }));
    addLog("Test de connexion Supabase...");

    try {
      const isConnected = await testConnection();
      
      if (isConnected) {
        addLog("✅ Connexion Supabase OK");
        setStatus(prev => ({ ...prev, step: 'export', loading: false }));
      } else {
        throw new Error("Connexion Supabase échouée");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur inconnue";
      addLog(`❌ Erreur: ${message}`);
      setStatus(prev => ({ ...prev, error: message, loading: false }));
    }
  };

  // ÉTAPE 2 : Export localStorage
  const handleExportData = async () => {
    setStatus(prev => ({ ...prev, loading: true, error: null }));
    addLog("Export des données localStorage...");

    try {
      const exportData = exportLocalStorageData();
      
      addLog(`✅ Export réussi: ${exportData.stats.clientsCount} clients, ${exportData.stats.productsCount} produits, ${exportData.stats.devisCount} devis`);
      
      // Sauvegarde automatique
      saveExportToFile(exportData);
      addLog("💾 Fichier de sauvegarde créé");
      
      setStatus(prev => ({ 
        ...prev, 
        exportData, 
        step: 'import', 
        loading: false 
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur export";
      addLog(`❌ Erreur export: ${message}`);
      setStatus(prev => ({ ...prev, error: message, loading: false }));
    }
  };

  // ÉTAPE 3 : Import vers Supabase
  const handleImportData = async () => {
    if (!status.exportData) return;

    setStatus(prev => ({ ...prev, loading: true, error: null }));
    addLog("Import vers Supabase...");

    try {
      await importToSupabase(status.exportData);
      addLog("✅ Import Supabase terminé");
      setStatus(prev => ({ ...prev, step: 'cleanup', loading: false }));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur import";
      addLog(`❌ Erreur import: ${message}`);
      setStatus(prev => ({ ...prev, error: message, loading: false }));
    }
  };

  // ÉTAPE 4 : Nettoyage localStorage
  const handleCleanup = async () => {
    setStatus(prev => ({ ...prev, loading: true }));
    addLog("Nettoyage localStorage...");

    try {
      // Supprimer les anciens storages
      localStorage.removeItem('devis_creator_clients');
      localStorage.removeItem('devis_creator_products');
      localStorage.removeItem('devis_creator_devis');
      
      addLog("✅ localStorage nettoyé");
      addLog("🎉 Migration Big-Bang terminée avec succès !");
      
      setStatus(prev => ({ ...prev, step: 'done', loading: false }));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur nettoyage";
      addLog(`❌ Erreur: ${message}`);
      setStatus(prev => ({ ...prev, error: message, loading: false }));
    }
  };

  const steps = [
    { key: 'test', label: 'Test Connexion', icon: Database },
    { key: 'export', label: 'Export Données', icon: Download },
    { key: 'import', label: 'Import Supabase', icon: Upload },
    { key: 'cleanup', label: 'Nettoyage', icon: CheckCircle }
  ];

  const currentStepIndex = steps.findIndex(s => s.key === status.step);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className={cn(
          "inline-flex items-center space-x-3 p-4 rounded-xl mb-4",
          "bg-gradient-to-r from-orange-500/20 to-red-500/20",
          "border border-orange-200 backdrop-blur-md"
        )}>
          <Zap className="w-8 h-8 text-orange-600" />
          <div>
            <h1 className="text-2xl font-bold text-orange-900">
              Migration Big-Bang vers Supabase
            </h1>
            <p className="text-orange-700">
              Processus de migration unique - À NE FAIRE QU'UNE SEULE FOIS
            </p>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex justify-center">
        <div className="flex items-center space-x-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = status.step === step.key;
            const isCompleted = index < currentStepIndex;
            const isDisabled = index > currentStepIndex;

            return (
              <div key={step.key} className="flex items-center">
                <div className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-lg",
                  isActive && "bg-blue-500/20 border-2 border-blue-500",
                  isCompleted && "bg-green-500/20 border-2 border-green-500",
                  isDisabled && "bg-gray-100 opacity-50"
                )}>
                  <Icon className={cn(
                    "w-5 h-5",
                    isActive && "text-blue-600",
                    isCompleted && "text-green-600",
                    isDisabled && "text-gray-400"
                  )} />
                  <span className={cn(
                    "font-medium",
                    isActive && "text-blue-900",
                    isCompleted && "text-green-900",
                    isDisabled && "text-gray-500"
                  )}>
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-8 h-0.5 bg-gray-300 mx-2" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="text-center">
        {status.step === 'test' && (
          <button
            onClick={handleTestConnection}
            disabled={status.loading}
            className={cn(
              "px-8 py-4 rounded-lg font-medium text-lg",
              "bg-blue-600 hover:bg-blue-700 text-white",
              "shadow-lg hover:shadow-xl transition-all duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {status.loading ? "Test en cours..." : "🔍 Tester la connexion Supabase"}
          </button>
        )}

        {status.step === 'export' && (
          <button
            onClick={handleExportData}
            disabled={status.loading}
            className={cn(
              "px-8 py-4 rounded-lg font-medium text-lg",
              "bg-green-600 hover:bg-green-700 text-white",
              "shadow-lg hover:shadow-xl transition-all duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {status.loading ? "Export en cours..." : "📦 Exporter les données localStorage"}
          </button>
        )}

        {status.step === 'import' && (
          <button
            onClick={handleImportData}
            disabled={status.loading}
            className={cn(
              "px-8 py-4 rounded-lg font-medium text-lg",
              "bg-purple-600 hover:bg-purple-700 text-white",
              "shadow-lg hover:shadow-xl transition-all duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {status.loading ? "Import en cours..." : "🚀 Importer vers Supabase"}
          </button>
        )}

        {status.step === 'cleanup' && (
          <button
            onClick={handleCleanup}
            disabled={status.loading}
            className={cn(
              "px-8 py-4 rounded-lg font-medium text-lg",
              "bg-red-600 hover:bg-red-700 text-white",
              "shadow-lg hover:shadow-xl transition-all duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {status.loading ? "Nettoyage..." : "🧹 Nettoyer localStorage"}
          </button>
        )}

        {status.step === 'done' && (
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              Migration terminée !
            </h2>
            <p className="text-gray-600 mb-4">
              Votre application utilise maintenant Supabase
            </p>
            
              <Link  href="/"
              className={cn(
                "inline-block px-6 py-3 rounded-lg font-medium",
                "bg-blue-600 hover:bg-blue-700 text-white",
                "shadow-lg hover:shadow-xl transition-all duration-200"
              )}
            >
              Retourner à l'application
            </Link>
          </div>
        )}
      </div>

      {/* Erreurs */}
      {status.error && (
        <div className={cn(
          "p-4 rounded-lg border",
          "bg-red-50 border-red-200"
        )}>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="font-medium text-red-800">Erreur</span>
          </div>
          <p className="text-red-700 mt-2">{status.error}</p>
        </div>
      )}

      {/* Logs */}
      <div className={cn(
        "p-4 rounded-lg border border-gray-200",
        "bg-gray-50 backdrop-blur-sm max-h-60 overflow-y-auto"
      )}>
        <h3 className="font-medium text-gray-900 mb-2">📝 Logs de migration</h3>
        <div className="space-y-1 font-mono text-sm">
          {status.logs.length === 0 ? (
            <p className="text-gray-500">En attente...</p>
          ) : (
            status.logs.map((log, index) => (
              <div key={index} className="text-gray-700">
                {log}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}