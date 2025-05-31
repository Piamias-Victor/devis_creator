import { MainLayout } from "@/components/layout/MainLayout";
import { ClientsPage } from "@/components/clients/ClientsPage";

/**
 * Route page /clients
 * Interface complète de gestion des clients
 */
export default function ClientsRoute() {
  return (
    <MainLayout>
      <ClientsPage />
    </MainLayout>
  );
}