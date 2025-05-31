"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { ProductSearch } from "@/components/products/ProductSearch";

/**
 * Route page /products
 * Catalogue complet des produits
 */
export default function ProductsPage() {
  const handleSelectProduct = (product: any) => {
    // Placeholder - en production rediriger vers création devis
    alert(`Produit sélectionné: ${product.designation}`);
  };

  return (
    <MainLayout>
      <ProductSearch onSelect={handleSelectProduct} />
    </MainLayout>
  );
}