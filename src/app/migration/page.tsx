"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { MigrationInterface } from "@/components/migration/MigrationInterface";

/**
 * Page temporaire pour la migration Big-Bang
 * À SUPPRIMER après migration réussie
 * 
 * IMPORTANT: Force dynamic rendering pour éviter prerender
 */

// Forcer le rendu dynamique (pas de prerender)
export const dynamic = 'force-dynamic';

export default function MigrationPage() {
  return (
    <MainLayout>
      <MigrationInterface />
    </MainLayout>
  );
}