"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DevisLayout } from "./layout/DevisLayout";
import { Client, Product } from "@/types";
import { generateDevisNumber, calculateValidityDate } from "@/lib/utils/devisUtils";
import { ClientStorage } from "@/lib/storage/clientStorage";
import { PdfGenerator } from "@/lib/pdf/pdfGenerator";
import { ClientModal } from "../clients/ClientModal";
import { useDevis } from "@/lib/hooks/useDevis";
import { DevisRepository } from "@/lib/repositories/devisRepository";

/**
 * Composant principal de création de devis CORRIGÉ
 * Fix : Charger le vrai numéro depuis la DB pour devis existants
 */
function DevisCreationCore() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const devisId = searchParams?.get('id');
  
  // État du devis
  const [numeroDevis, setNumeroDevis] = useState("2025-0000-0000");
  const [dateCreation, setDateCreation] = useState(new Date());
  const [dateValidite, setDateValidite] = useState(new Date());
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [saving, setSaving] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [loadingDevis, setLoadingDevis] = useState(false);

  // Modal création client
  const [showClientModal, setShowClientModal] = useState(false);
  const [clientModalLoading, setClientModalLoading] = useState(false);

  // Hook de gestion du devis
  const {
    lignes,
    calculations,
    isDirty,
    lastSaved,
    addLine,
    updateLine,
    deleteLine,
    duplicateLine,
    saveDevis
  } = useDevis(devisId || undefined);

  // NOUVEAU : Charger devis complet pour récupérer numéro + client
  const loadDevisDetails = async (devisIdToLoad: string) => {
    try {
      setLoadingDevis(true);
      console.log('🔄 Chargement détails devis:', devisIdToLoad);

      const devis = await DevisRepository.getDevisById(devisIdToLoad);
      
      if (devis) {
        // ✅ CORRECTION : Utiliser le vrai numéro de la DB
        setNumeroDevis(devis.numero);
        setDateCreation(devis.date);
        setDateValidite(devis.dateValidite);
        
        // Charger le client associé
        if (devis.clientId) {
          try {
            // const client = ClientStorage.getClientById(devis.clientId);
            // if (client) {
            //   setSelectedClient(client);
            //   console.log('✅ Client chargé:', client.nom);
            // }
          } catch (error) {
            console.warn('⚠️ Client non trouvé:', devis.clientId);
          }
        }
        
        console.log('✅ Détails devis chargés:', devis.numero);
      }
    } catch (error) {
      console.error('❌ Erreur chargement détails:', error);
    } finally {
      setLoadingDevis(false);
    }
  };

  // Initialisation côté client
  useEffect(() => {
    setIsClient(true);
    
    if (devisId) {
      console.log("📝 Mode édition - chargement devis:", devisId);
      loadDevisDetails(devisId);
    } else {
      console.log("📝 Mode création - nouveau devis");
      setNumeroDevis(generateDevisNumber());
      const now = new Date();
      setDateCreation(now);
      setDateValidite(calculateValidityDate(now));
    }
  }, [devisId]);

  // Affichage loading
  if (!isClient || loadingDevis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            {devisId ? "Chargement du devis..." : "Nouveau devis..."}
          </p>
        </div>
      </div>
    );
  }

  // Sélectionner un client
  const handleSelectClient = (client: Client) => {
    console.log("👤 Client sélectionné:", client.nom);
    setSelectedClient(client);
  };

  // Créer un nouveau client
  const handleCreateClient = () => {
    console.log("➕ Ouverture modal création client");
    setShowClientModal(true);
  };

  // Sauvegarder nouveau client depuis modal
  const handleSaveNewClient = async (clientData: Omit<Client, "id" | "createdAt">) => {
    setClientModalLoading(true);
    
    try {
      const newClient = ClientStorage.addClient(clientData);
      setSelectedClient(newClient);
      setShowClientModal(false);
      console.log("✅ Nouveau client créé et sélectionné:", newClient.nom);
    } catch (error) {
      alert("Erreur lors de la création du client");
    } finally {
      setClientModalLoading(false);
    }
  };

  // Ajouter un produit
  const handleAddProduct = (product: Product) => {
    addLine(product);
  };

  // Sauvegarder le devis AVEC SUPABASE
  const handleSave = async () => {
    if (!selectedClient) {
      alert("Veuillez sélectionner un client");
      return;
    }

    if (lignes.length === 0) {
      alert("Ajoutez au moins un produit au devis");
      return;
    }

    setSaving(true);
    
    try {
      const savedDevisId = await saveDevis(
        selectedClient,
        dateValidite,
        undefined // notes optionnelles
      );
      
      console.log("✅ Devis sauvegardé en Supabase:", savedDevisId);
      alert(`Devis sauvegardé avec succès !`);
      
      if (!devisId) {
        router.push(`/devis?saved=${savedDevisId}`);
      }
      
    } catch (error) {
      console.error("❌ Erreur sauvegarde Supabase:", error);
      const message = error instanceof Error ? error.message : "Erreur lors de la sauvegarde";
      alert(`Erreur: ${message}`);
    } finally {
      setSaving(false);
    }
  };

  // Annuler et retourner
  const handleCancel = () => {
    if (isDirty) {
      if (!confirm("Êtes-vous sûr de vouloir quitter ? Les modifications non sauvegardées seront perdues.")) {
        return;
      }
    }
    
    router.push("/devis");
  };

  // Export PDF
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
    <>
      <DevisLayout
        client={selectedClient}
        numeroDevis={numeroDevis} // ✅ Maintenant utilisé le vrai numéro
        dateCreation={dateCreation}
        dateValidite={dateValidite}
        lignes={lignes}
        calculations={calculations}
        onSave={handleSave}
        onCancel={handleCancel}
        onExportPDF={handleExportPDF}
        onSelectClient={handleSelectClient}
        onCreateClient={handleCreateClient}
        onAddProduct={handleAddProduct}
        onUpdateLine={updateLine}
        onDeleteLine={deleteLine}
        onDuplicateLine={duplicateLine}
        saving={saving}
        isDirty={isDirty}
        lastSaved={lastSaved}
        isEditing={!!devisId}
      />

      {/* Modal création client */}
      <ClientModal
        isOpen={showClientModal}
        onClose={() => setShowClientModal(false)}
        onSubmit={handleSaveNewClient}
        loading={clientModalLoading}
      />
    </>
  );
}

export { DevisCreationCore as DevisCreation };