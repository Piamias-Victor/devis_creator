import { supabase, handleSupabaseError } from '@/lib/database/supabase';

interface MigrationData {
  clients: any[];
  products: any[];
  devis: any[];
  stats: any;
}

export async function importToSupabase(data: MigrationData): Promise<void> {
  console.log('🚀 Import vers Supabase...');
  
  try {
    // 1. VIDER LES TABLES EXISTANTES (mode Big-Bang)
    console.log('🧹 Nettoyage tables existantes...');
    
    // Ordre important : supprimer les FK en premier
    await supabase.from('lignes_devis').delete().gte('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('devis').delete().gte('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('produits').delete().gte('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('clients').delete().gte('id', '00000000-0000-0000-0000-000000000000');
    
    console.log('✅ Tables nettoyées');

    // 2. IMPORT CLIENTS avec gestion des erreurs
    console.log('👥 Import clients...');
    let clientsImported = 0;
    const clientMapping = new Map<string, string>(); // nom → id
    
    for (const clientData of data.clients) {
      try {
        const { data: clientInserted, error } = await supabase
          .from('clients')
          .insert({
            nom: clientData.nom,
            adresse: clientData.adresse,
            telephone: clientData.telephone,
            email: clientData.email,
            siret: clientData.siret
          })
          .select('id, nom')
          .single();
        
        if (error) {
          console.warn(`⚠️ Client "${clientData.nom}" ignoré:`, error.message);
        } else {
          clientMapping.set(clientData.nom, clientInserted.id);
          clientsImported++;
        }
      } catch (err) {
        console.warn(`⚠️ Erreur client "${clientData.nom}":`, err);
      }
    }
    console.log(`✅ ${clientsImported}/${data.clients.length} clients importés`);

    // 3. RÉCUPÉRER CATÉGORIE PAR DÉFAUT
    const { data: defaultCategory } = await supabase
      .from('categories')
      .select('id')
      .eq('nom', 'Incontinence')
      .single();
    
    if (!defaultCategory) {
      throw new Error('Catégorie par défaut introuvable');
    }

    // 4. IMPORT PRODUITS avec validation
    console.log('📦 Import produits...');
    let productsImported = 0;
    const productMapping = new Map<string, string>(); // code → id
    
    for (const productData of data.products) {
      try {
        // Validation des données
        const prixAchat = parseFloat(productData.prix_achat) || 0;
        const prixVente = parseFloat(productData.prix_vente) || prixAchat * 1.1;
        
        if (prixAchat <= 0) {
          console.warn(`⚠️ Produit "${productData.code}" ignoré: prix invalide`);
          continue;
        }
        
        const { data: productInserted, error } = await supabase
          .from('produits')
          .insert({
            code: productData.code,
            designation: productData.designation,
            prix_achat: prixAchat,
            prix_vente: prixVente,
            tva: parseFloat(productData.tva) || 20,
            colissage: parseInt(productData.colissage) || 1,
            categorie_id: defaultCategory.id
          })
          .select('id, code')
          .single();
        
        if (error) {
          console.warn(`⚠️ Produit "${productData.code}" ignoré:`, error.message);
        } else {
          productMapping.set(productData.code, productInserted.id);
          productsImported++;
        }
      } catch (err) {
        console.warn(`⚠️ Erreur produit "${productData.code}":`, err);
      }
    }
    console.log(`✅ ${productsImported}/${data.products.length} produits importés`);

    // 5. IMPORT DEVIS SIMPLIFIÉS
    console.log('📄 Import devis...');
    let devisImported = 0;
    
    for (const devisData of data.devis) {
      try {
        // Trouver le client correspondant
        const clientId = clientMapping.get(devisData.client_siret);
        if (!clientId) {
          console.warn(`⚠️ Devis "${devisData.numero}" ignoré: client introuvable`);
          continue;
        }
        
        const { error } = await supabase
          .from('devis')
          .insert({
            numero: devisData.numero,
            client_id: clientId,
            date_creation: devisData.date_creation,
            date_validite: devisData.date_validite,
            status: devisData.status || 'brouillon',
            total_ht: parseFloat(devisData.total_ht) || 0,
            total_ttc: parseFloat(devisData.total_ttc) || 0,
            marge_globale_pourcent: parseFloat(devisData.marge_globale_pourcent) || 0
          });
        
        if (error) {
          console.warn(`⚠️ Devis "${devisData.numero}" ignoré:`, error.message);
        } else {
          devisImported++;
        }
      } catch (err) {
        console.warn(`⚠️ Erreur devis "${devisData.numero}":`, err);
      }
    }
    console.log(`✅ ${devisImported}/${data.devis.length} devis importés`);
    
    // 6. RÉSUMÉ FINAL
    console.log('🎉 Migration terminée !');
    console.log(`📊 Résumé: ${clientsImported} clients, ${productsImported} produits, ${devisImported} devis`);
    
  } catch (error) {
    console.error('❌ Erreur critique migration:', error);
    throw error;
  }
}

/**
 * FONCTION DE VÉRIFICATION POST-MIGRATION
 */
export async function verifyMigration(): Promise<{
  clients: number;
  produits: number;
  devis: number;
  categories: number;
}> {
  try {
    const [
      { count: clientsCount },
      { count: produitsCount },
      { count: devisCount },
      { count: categoriesCount }
    ] = await Promise.all([
      supabase.from('clients').select('*', { count: 'exact', head: true }),
      supabase.from('produits').select('*', { count: 'exact', head: true }),
      supabase.from('devis').select('*', { count: 'exact', head: true }),
      supabase.from('categories').select('*', { count: 'exact', head: true })
    ]);
    
    return {
      clients: clientsCount || 0,
      produits: produitsCount || 0,
      devis: devisCount || 0,
      categories: categoriesCount || 0
    };
  } catch (error) {
    console.error('Erreur vérification:', error);
    return { clients: 0, produits: 0, devis: 0, categories: 0 };
  }
}