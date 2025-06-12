import { AuthGuard } from "@/components/auth/AuthGuard";
import { AdminGuard } from "@/components/auth/AdminGuard";
import { MainLayout } from "@/components/layout/MainLayout";
import { AdminPage } from "@/components/admin/AdminPage";

/**
 * Route page /admin
 * Page d'administration accessible uniquement aux admins
 */
export default function AdminRoute() {
  return (
    <AuthGuard>
      <AdminGuard>
        <MainLayout>
          <AdminPage />
        </MainLayout>
      </AdminGuard>
    </AuthGuard>
  );
}