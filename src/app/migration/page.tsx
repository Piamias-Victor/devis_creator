"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { MigrationInterface } from "@/components/migration/MigrationInterface";

/**
 * Page temporaire pour la migration Big-Bang
 * À SUPPRIMER après migration réussie
 */
export default function MigrationPage() {
  return (
    <MainLayout>
      <MigrationInterface />
    </MainLayout>
  );
}