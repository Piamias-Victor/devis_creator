import { MainLayout } from "@/components/layout/MainLayout";
import { ProductsManagementPage } from "@/components/products/ProductsManagementPage";

/**
 * Route page /products MODIFIÉE
 * Interface complète CRUD produits en ligne
 */
export default function ProductsPageRoute() {
  return (
    <MainLayout>
      <ProductsManagementPage />
    </MainLayout>
  );
}