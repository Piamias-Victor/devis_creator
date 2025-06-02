"use client";

import { AuthGuard } from "@/components/auth/AuthGuard";
import { MainLayout } from "@/components/layout/MainLayout";
import { DevisListPage } from "@/components/devis/DevisListPage";

/**
 * Route page /devis
 * Liste complète des devis sauvegardés
 */
export default function DevisRoute() {
  return (
    <AuthGuard>
      <MainLayout>
        <DevisListPage />
      </MainLayout>
    </AuthGuard>
  );
}