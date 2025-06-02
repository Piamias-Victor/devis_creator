import { AuthGuard } from "@/components/auth/AuthGuard";
import { MainLayout } from "@/components/layout/MainLayout";
import { DevisCreation } from "@/components/devis/DevisCreationWrapper";

/**
 * Page nouveau devis AVEC Suspense
 * Fix erreur Next.js 15 useSearchParams
 */
export default function NewDevisPage() {
  return (
    <AuthGuard>
      <MainLayout>
        <DevisCreation />
      </MainLayout>
    </AuthGuard>
  );
}