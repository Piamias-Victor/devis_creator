import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DevisLayout } from "./layout/DevisLayout";
import { Client, DevisLine, Product } from "@/types";
import { generateDevisNumber, calculateValidityDate } from "@/lib/utils/devisUtils";
import { ClientModal } from "../clients/ClientModal";
import { useDevis } from "@/lib/hooks/useDevis";
import { useClients } from "@/lib/hooks/useClients";
import { useDevisSort } from "./table/useDevisSort";
import { DevisRepository } from "@/lib/repositories/devisRepository";
import { supabase } from "@/lib/database/supabase";
import { getPharmaciesList } from "@/config/pharmacies"; // ✅ NOUVEAU: Import config pharmacies

const handleSaveLineToDatabase = async (ligne: DevisLine): Promise<void> => {
  try {
    console.log('💾 Sauvegarde ligne en DB:', ligne.designation);

    const { error } = await supabase
      .from('produits')
      .update({
        prix_achat: ligne.prixAchat || 0,
        prix_vente: ligne.prixUnitaire,
        tva: ligne.tva,
        colissage: ligne.colissage || 1
      })
      .eq('code', ligne.productCode);

    if (error) {
      throw new Error(`Erreur lors de la mise à jour du produit : ${error.message}`);
    }

    console.log('✅ Ligne sauvegardée avec succès dans la base');
  } catch (err) {
    console.error('❌ Erreur lors de la sauvegarde de la ligne :', err);
    alert(`Erreur lors de la sauvegarde de la ligne : ${(err as Error).message}`);
  }
};

/**
 * Composant principal de création de devis CORRIGÉ
 * Élimination de la boucle infinie de chargement client
 */
function DevisCreationCore() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const devisId = searchParams?.get('id');
  
  // Hook clients ajouté pour récupération automatique
  const { clients, loading: clientsLoading } = useClients();
  
  // État du devis
  const [numeroDevis, setNumeroDevis] = useState("2025-0000-0000");
  const [dateCreation, setDateCreation] = useState(new Date());
  const [dateValidite, setDateValidite] = useState(new Date());
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedPharmacieId, setSelectedPharmacieId] = useState<string>('rond-point'); // ✅ NOUVEAU: État pharmacie
  const [saving, setSaving] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [loadingDevis, setLoadingDevis] = useState(false);
  const [devisLoaded, setDevisLoaded] = useState(false); // GARDE anti-boucle

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

  // Hook tri avec protection contre undefined
  const sortData = useDevisSort(lignes);
  const sortedLignes = sortData.sortedLignes || lignes || [];
  const sortField = sortData.sortField || 'designation';
  const sortDirection = sortData.sortDirection || 'asc';

  // Liste des pharmacies disponibles
  const pharmaciesList = getPharmaciesList(); // ✅ NOUVEAU: Récupérer la liste des pharmacies

  // FONCTION CORRIGÉE avec garde anti-boucle
  const loadDevisDetails = async (devisIdToLoad: string) => {
    // GARDE - éviter double chargement
    if (devisLoaded || loadingDevis) {
      console.log('⏭️ Devis déjà chargé, skip');
      return;
    }

    try {
      setLoadingDevis(true);
      console.log('🔄 Chargement détails devis:', devisIdToLoad);

      const devis = await DevisRepository.getDevisById(devisIdToLoad);
      
      if (devis) {
        setNumeroDevis(devis.numero);
        setDateCreation(devis.date);
        setDateValidite(devis.dateValidite);
        setSelectedPharmacieId(devis.pharmacieId || 'rond-point'); // ✅ NOUVEAU: Charger la pharmacie
        
        // Récupération client via hook useClients
        if (devis.clientId && clients.length > 0) {
          const client = clients.find(c => c.id === devis.clientId);
          if (client) {
            setSelectedClient(client);
            console.log('✅ Client récupéré:', client.nom);
          } else {
            console.warn('⚠️ Client non trouvé dans la liste:', devis.clientId);
          }
        }
        
        setDevisLoaded(true); // MARQUER COMME CHARGÉ
        console.log('✅ Détails devis chargés:', devis.numero, 'Pharmacie:', devis.pharmacieId);
      }
    } catch (error) {
      console.error('❌ Erreur chargement détails:', error);
    } finally {
      setLoadingDevis(false);
    }
  };

  // EFFET UNIFIÉ - Initialisation côté client avec garde
  useEffect(() => {
    setIsClient(true);
    
    if (devisId && !devisLoaded) {
      console.log("📝 Mode édition - chargement devis:", devisId);
      // Attendre que les clients soient chargés AVANT le devis
      if (!clientsLoading && clients.length > 0) {
        loadDevisDetails(devisId);
      }
    } else if (!devisId && !devisLoaded) {
      console.log("📝 Mode création - nouveau devis");
      setNumeroDevis(generateDevisNumber());
      const now = new Date();
      setDateCreation(now);
      setDateValidite(calculateValidityDate(now));
      setDevisLoaded(true); // Éviter re-initialisation
    }
  }, [devisId, clients, clientsLoading, devisLoaded]);

  // Fonction pour actualiser les produits depuis la DB
  const handleRefreshProducts = async (): Promise<void> => {
    if (lignes.length === 0) {
      throw new Error("Aucun produit à actualiser");
    }

    console.log('🔄 Actualisation produits depuis Supabase...');
    
    const productCodes = lignes.map(ligne => ligne.productCode);
    
    try {
      const { data: produits, error } = await supabase
        .from('produits')
        .select('code, prix_achat, prix_vente, tva, colissage')
        .in('code', productCodes);

      if (error) {
        throw new Error(`Erreur DB: ${error.message}`);
      }

      if (!produits || produits.length === 0) {
        throw new Error("Aucun produit trouvé en base");
      }

      console.log(`✅ ${produits.length} produits récupérés de la DB`);

      let updatedCount = 0;
      
      for (const ligne of lignes) {
        const produitDB = produits.find((p: any) => p.code === ligne.productCode);
        
        if (produitDB) {
          const newPrixVente = Number(produitDB.prix_vente);
          const newPrixAchat = Number(produitDB.prix_achat);
          const newTva = Number(produitDB.tva || 20);
          const newColissage = produitDB.colissage || 1;
          
          const hasChanges = 
            ligne.prixUnitaire !== newPrixVente ||
            ligne.prixAchat !== newPrixAchat ||
            ligne.tva !== newTva ||
            ligne.colissage !== newColissage;
          
          if (hasChanges) {
            updateLine(ligne.id, {
              prixUnitaire: newPrixVente,
              prixAchat: newPrixAchat,
              tva: newTva,
              colissage: newColissage
            });
            
            updatedCount++;
            console.log(`🔄 Ligne mise à jour: ${ligne.designation}`);
          }
        } else {
          console.warn(`⚠️ Produit non trouvé en DB: ${ligne.productCode}`);
        }
      }

      if (updatedCount > 0) {
        console.log(`✅ ${updatedCount} ligne(s) mise(s) à jour avec les nouveaux prix`);
        alert(`✅ ${updatedCount} produit(s) mis à jour avec les prix actuels`);
      } else {
        console.log('ℹ️ Tous les prix sont déjà à jour');
        alert('ℹ️ Tous les prix sont déjà à jour');
      }

    } catch (error) {
      console.error('❌ Erreur actualisation produits:', error);
      throw error;
    }
  };

  // Affichage loading
  if (!isClient || loadingDevis || (devisId && !devisLoaded)) {
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
    // Implémentation sauvegarde client
  };

  // Ajouter un produit
  const handleAddProduct = (product: Product) => {
    addLine(product);
  };

  // ✅ NOUVEAU: Sauvegarder le devis AVEC PHARMACIE
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
      // ✅ NOUVEAU: Passer pharmacieId à saveDevis
      const savedDevisId = await saveDevis(
        selectedClient,
        dateValidite,
        undefined,
        selectedPharmacieId // ✅ NOUVEAU: Passer la pharmacie sélectionnée
      );
      
      console.log("✅ Devis sauvegardé en Supabase:", savedDevisId, "Pharmacie:", selectedPharmacieId);
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

  return (
    <>
      <DevisLayout
        client={selectedClient}
        numeroDevis={numeroDevis}
        dateCreation={dateCreation}
        dateValidite={dateValidite}
        lignes={lignes}
        calculations={calculations}
        sortedLignes={sortedLignes}
        sortField={sortField}
        sortDirection={sortDirection}
        selectedPharmacieId={selectedPharmacieId} // ✅ NOUVEAU: Passer la pharmacie sélectionnée
        pharmaciesList={pharmaciesList} // ✅ NOUVEAU: Passer la liste des pharmacies
        onPharmacieChange={setSelectedPharmacieId} // ✅ NOUVEAU: Handler changement pharmacie
        onSave={handleSave}
        onCancel={handleCancel}
        onExportPDF={() => {
          // ✅ NOUVEAU: Stocker pharmacieId dans sessionStorage pour le PDF
          if (selectedClient && lignes.length > 0) {
            const totaux = calculations;
            sessionStorage.setItem('pdfDevisData', JSON.stringify({
              numero: numeroDevis,
              date: dateCreation.toISOString(),
              dateValidite: dateValidite.toISOString(),
              client: selectedClient,
              pharmacieId: selectedPharmacieId, // ✅ NOUVEAU: Inclure pharmacieId
              lines: lignes,
              totaux,
              notes: '' // À gérer si vous avez des notes
            }));
            window.open('/devis/pdf', '_blank');
          }
        }}
        onSelectClient={handleSelectClient}
        onCreateClient={handleCreateClient}
        onAddProduct={handleAddProduct}
        onUpdateLine={updateLine}
        onDeleteLine={deleteLine}
        onDuplicateLine={duplicateLine}
        onRefreshProducts={handleRefreshProducts}
        saving={saving}
        isDirty={isDirty}
        lastSaved={lastSaved}
        isEditing={!!devisId}
        onSaveLineToDatabase={handleSaveLineToDatabase}
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