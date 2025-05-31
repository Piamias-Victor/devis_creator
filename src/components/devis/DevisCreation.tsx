"use client";

import { useState, useEffect } from "react";
import { DevisLayout } from "./layout/DevisLayout";
import { Client, Product } from "@/types";
import { generateDevisNumber, calculateValidityDate } from "@/lib/utils/devisUtils";
import { ClientStorage } from "@/lib/storage/clientStorage";
import { PdfGenerator } from "@/lib/pdf/pdfGenerator";
import { useDevis } from "@/lib/hooks/useDevis";

/**
 * Composant principal de création de devis - MODIFIÉ
 * Utilise le nouveau système de calculs automatiques + export PDF
 */
export function DevisCreation() {
  // État du devis avec valeurs par défaut pour SSR
  const [numeroDevis, setNumeroDevis] = useState("2025-0000-0000");
  const [dateCreation, setDateCreation] = useState(new Date("2025-01-01"));
  const [dateValidite, setDateValidite] = useState(new Date("2025-01-31"));
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [saving, setSaving] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Hook de gestion du devis MODIFIÉ avec calculs automatiques
  const {
    lignes,
    calculations,
    addLine,
    updateLine,
    deleteLine,
    duplicateLine,
    clearAll
  } = useDevis();

  // Initialisation côté client uniquement
  useEffect(() => {
    setIsClient(true);
    setNumeroDevis(generateDevisNumber());
    const now = new Date();
    setDateCreation(now);
    setDateValidite(calculateValidityDate(now));
  }, []);

  // Chargement du client par défaut (côté client uniquement)
  useEffect(() => {
    if (!isClient) return;
    
    const clients = ClientStorage.getClients();
    if (clients.length > 0) {
      setSelectedClient(clients[0]); // Premier client par défaut
    }
  }, [isClient]);

  // Affichage loading pendant hydratation
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Chargement du devis...</p>
        </div>
      </div>
    );
  }

  // Ajouter un produit (depuis recherche ou test)
  const handleAddProduct = (product?: Product) => {
    if (product) {
      // Produit sélectionné depuis la recherche
      addLine(product);
    } else {
      // Produit de test pour démonstration
      const testProduct: Product = {
        code: `TEST${lignes.length + 1}`,
        designation: `Produit de test ${lignes.length + 1}`,
        prixAchat: 8.50, // Prix d'achat pour calculer marge
        prixVente: 12.75, // Prix de vente = prix HT affiché
        unite: "pièce",
        categorie: "Test",
        colissage: 12, // Pour calcul colis
        tva: 20
      };
      addLine(testProduct);
    }
  };

  // Sauvegarder le devis
  const handleSave = async () => {
    if (!selectedClient) {
      alert("Veuillez sélectionner un client");
      return;
    }

    setSaving(true);
    
    try {
      // Simulation sauvegarde (localStorage à implémenter)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Devis sauvegardé:", {
        numero: numeroDevis,
        client: selectedClient,
        lignes,
        calculations
      });
      
      alert("Devis sauvegardé avec succès !");
      
    } catch (error) {
      alert("Erreur lors de la sauvegarde");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  // Annuler et retourner au dashboard
  const handleCancel = () => {
    if (lignes.length > 0) {
      if (!confirm("Êtes-vous sûr de vouloir quitter ? Les modifications seront perdues.")) {
        return;
      }
    }
    
    // Navigation vers dashboard
    window.location.href = "/";
  };

  // Export PDF - NOUVEAU
  const handleExportPDF = async () => {
    if (!selectedClient) {
      alert("Veuillez sélectionner un client avant d'exporter");
      return;
    }

    if (lignes.length === 0) {
      alert("Ajoutez au moins un produit avant d'exporter");
      return;
    }

    try {
      await PdfGenerator.generateAndDownload({
        numeroDevis,
        dateCreation,
        dateValidite,
        client: selectedClient,
        lignes,
        calculations
      });
      
    } catch (error) {
      console.error("Erreur export PDF:", error);
      alert("Erreur lors de l'export PDF. Veuillez réessayer.");
    }
  };

  return (
    <DevisLayout
      client={selectedClient}
      numeroDevis={numeroDevis}
      dateCreation={dateCreation}
      dateValidite={dateValidite}
      lignes={lignes}
      calculations={calculations}
      onSave={handleSave}
      onCancel={handleCancel}
      onExportPDF={handleExportPDF}
      onAddProduct={handleAddProduct}
      onUpdateLine={updateLine}
      onDeleteLine={deleteLine}
      onDuplicateLine={duplicateLine}
      saving={saving}
    />
  );
}