"use client";

import { Suspense } from "react";
import { DevisCreation } from "./DevisCreation";

/**
 * Wrapper avec Suspense pour useSearchParams
 * Requis par Next.js 15 pour le SSR
 */
function DevisCreationSuspended() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Chargement du devis...</p>
          </div>
        </div>
      }
    >
      <DevisCreation />
    </Suspense>
  );
}

export { DevisCreationSuspended as DevisCreation };