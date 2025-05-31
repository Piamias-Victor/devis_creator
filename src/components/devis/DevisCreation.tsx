"use client";

import { useState, useEffect } from "react";
import { DevisLayout } from "./layout/DevisLayout";
import { Client, Product, DevisLine } from "@/types";
import { generateDevisNumber, calculateValidityDate } from "@/lib/utils/devisUtils";
import { ClientStorage } from "@/lib/storage/clientStorage";
import { useDevis } from "@/lib/hooks/useDevis";

/**
 * Composant principal de création de devis
 * Gestion d'état et logique métier
 */
export function DevisCreation() {
  // État du devis avec valeurs par défaut pour SSR
  const [numeroDevis, setNumeroDevis] = useState("2025-0000-0000");
  const [dateCreation, setDateCreation] = useState(new Date("2025-01-01"));
  const [dateValidite, setDateValidite] = useState(new Date("2025-01-31"));
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [saving, setSaving] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Hook de gestion du devis
  const {
    lignes,
    remiseGlobale,
    setRemiseGlobale,
    addLine,
    updateLine,
    deleteLine,
    duplicateLine,
    clearAll,
    totals
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

  // Raccourcis clavier (côté client uniquement)
  useEffect(() => {
    if (!isClient) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'a':
            e.preventDefault();
            handleAddProduct();
            break;
          case 's':
            e.preventDefault();
            handleSave();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
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

  return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isClient]);

  // Ajouter un produit (depuis recherche ou test)
  const handleAddProduct = (product?: Product) => {
    if (product) {
      // Produit sélectionné depuis la recherche
      addLine(product);
    } else {
      // Produit de test (bouton rapide) - créer un produit temporaire
      const testProduct: Product = {
        code: `TEST${lignes.length + 1}`,
        designation: `Produit de test ${lignes.length + 1}`,
        prixAchat: 8.50, // Prix d'achat pour calculer marge
        prixVente: 10.50, // Prix de vente = prix HT affiché
        unite: "pièce",
        categorie: "Test",
        colissage: 12, // Pour calcul colis
        tva: 20
      };
      addLine(testProduct);
    }
  };

  // Mettre à jour une ligne
  const handleUpdateLine = (id: string, updates: Partial<DevisLine>) => {
    updateLine(id, updates);
  };

  // Supprimer une ligne
  const handleDeleteLine = (id: string) => {
    deleteLine(id);
  };

  // Dupliquer une ligne
  const handleDuplicateLine = (id: string) => {
    duplicateLine(id);
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
      
      // Ici on sauvegarderait en localStorage
      console.log("Devis sauvegardé:", {
        numero: numeroDevis,
        client: selectedClient,
        lignes,
        dateCreation,
        dateValidite
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

  // Export PDF (placeholder)
  const handleExportPDF = () => {
    alert("Export PDF à implémenter en Phase 7");
  };

  return (
    <DevisLayout
      client={selectedClient}
      numeroDevis={numeroDevis}
      dateCreation={dateCreation}
      dateValidite={dateValidite}
      lignes={lignes}
      remiseGlobale={remiseGlobale}
      onChangeRemiseGlobale={setRemiseGlobale}
      onSave={handleSave}
      onCancel={handleCancel}
      onExportPDF={handleExportPDF}
      onAddProduct={handleAddProduct}
      onUpdateLine={handleUpdateLine}
      onDeleteLine={handleDeleteLine}
      onDuplicateLine={handleDuplicateLine}
      totals={totals}
      saving={saving}
    />
  );
}