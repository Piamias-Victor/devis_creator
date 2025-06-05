import { ClientStorage } from '@/lib/storage/clientStorage';
import { ProductStorage } from '@/lib/storage/productStorage';
import { DevisStorage } from '@/lib/storage/devisStorage';

interface MigrationData {
  clients: any[];
  products: any[];
  devis: any[];
  stats: {
    clientsCount: number;
    productsCount: number;
    devisCount: number;
  };
}

export function exportLocalStorageData(): MigrationData {
  console.log('🔄 Export des données localStorage...');
  
  // Export clients
  const clients = ClientStorage.getClients().map(client => ({
    nom: client.nom,
    adresse: client.adresse,
    telephone: client.telephone,
    email: client.email,
    siret: client.siret,
    created_at: client.createdAt.toISOString()
  }));
  
  // Export produits
  const products = ProductStorage.getProducts().map(product => ({
    code: product.code,
    designation: product.designation,
    prix_achat: product.prixAchat,
    prix_vente: product.prixVente || product.prixAchat * 1.1,
    tva: product.tva,
    colissage: product.colissage,
    categorie_nom: product.categorie || 'Incontinence'
  }));
  
  // Export devis
  const devis = DevisStorage.getDevis().map(d => ({
    numero: d.numero,
    client_siret: d.clientNom, // On va matcher par nom temporairement
    date_creation: d.date.toISOString().split('T')[0],
    date_validite: d.dateValidite.toISOString().split('T')[0],
    status: d.status,
    total_ht: d.totalHT,
    total_ttc: d.totalTTC,
    marge_globale_pourcent: d.margeGlobale,
    lignes: d.lignes,
    created_at: d.createdAt.toISOString()
  }));
  
  const migrationData = {
    clients,
    products,
    devis,
    stats: {
      clientsCount: clients.length,
      productsCount: products.length,
      devisCount: devis.length
    }
  };
  
  console.log('✅ Export terminé:', migrationData.stats);
  return migrationData;
}

export function saveExportToFile(data: MigrationData): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `migration-data-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  
  console.log('💾 Fichier de sauvegarde créé');
}