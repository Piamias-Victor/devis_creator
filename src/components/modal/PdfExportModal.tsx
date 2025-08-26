import { useState } from 'react';
import { X, FileText, Package } from 'lucide-react';
import { PdfExportOptions, PdfExportModalProps } from '@/types';
import { cn } from '@/lib/utils';

/**
 * Modal de confirmation pour l'export PDF avec options
 */
export function PdfExportModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  loading = false 
}: PdfExportModalProps) {
  
  const [showNombreCartons, setShowNombreCartons] = useState(true);

  // Gérer la confirmation avec les options sélectionnées
  const handleConfirm = () => {
    const options: PdfExportOptions = {
      showNombreCartons
    };
    onConfirm(options);
  };

  // Gérer la fermeture avec Escape
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header du modal */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Export PDF
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Configurez vos options d'export
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenu du modal */}
        <div className="p-6 space-y-4">
          {/* Option nombre de cartons */}
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={showNombreCartons}
                  onChange={(e) => setShowNombreCartons(e.target.checked)}
                  className={cn(
                    "w-5 h-5 rounded border-2 transition-all duration-200",
                    "text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                    "border-gray-300 dark:border-gray-600",
                    "bg-white dark:bg-gray-700",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                  disabled={loading}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Package className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Afficher le nombre de cartons
                </span>
              </div>
            </label>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 ml-8">
              {showNombreCartons 
                ? "Les informations de cartons seront visibles sous chaque produit" 
                : "Les informations de cartons seront masquées dans le PDF"
              }
            </p>
          </div>

          {/* Aperçu de l'option */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border-l-4 border-blue-500">
            <div className="text-sm">
              <div className="font-medium text-gray-900 dark:text-white mb-2">
                Aperçu dans le PDF :
              </div>
              <div className="text-gray-600 dark:text-gray-300 font-mono text-xs">
                Couche TENA Slip Super Taille M
                {showNombreCartons && (
                  <div className="text-gray-500 dark:text-gray-400">
                    * 2 CARTONS
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer avec boutons d'action */}
        <div className="flex items-center justify-end space-x-3 p-6 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            disabled={loading}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium",
              "text-gray-700 dark:text-gray-300",
              "hover:bg-gray-200 dark:hover:bg-gray-600",
              "border border-gray-300 dark:border-gray-600",
              "transition-colors duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            Annuler
          </button>
          
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={cn(
              "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium",
              "bg-blue-600 hover:bg-blue-700 text-white",
              "transition-colors duration-200",
              "shadow-sm hover:shadow-md",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Génération...</span>
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                <span>Télécharger PDF</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}