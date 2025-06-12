import { AuthGuard } from "@/components/auth/AuthGuard";
import { AdminGuard } from "@/components/auth/AdminGuard";
import { MainLayout } from "@/components/layout/MainLayout";
import { StatsPage } from "@/components/stats/StatsPage";

/**
 * Route page /stats
 * Page statistiques accessible uniquement aux admins
 */
export default function StatsRoute() {
  return (
    <AuthGuard>
      <AdminGuard>
        <MainLayout>
          <StatsPage />
        </MainLayout>
      </AdminGuard>
    </AuthGuard>
  );
}