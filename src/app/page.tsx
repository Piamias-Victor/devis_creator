import { AuthGuard } from "@/components/auth/AuthGuard";
import { MainLayout } from "@/components/layout/MainLayout";
import { Dashboard } from "@/components/dashboard/Dashboard";

/**
 * Page d'accueil protégée par authentification
 */
export default function Home() {
  return (
    <AuthGuard>
      <MainLayout>
        <Dashboard />
      </MainLayout>
    </AuthGuard>
  );
}