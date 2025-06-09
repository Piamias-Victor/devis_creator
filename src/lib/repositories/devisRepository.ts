import { supabase, handleSupabaseError } from "@/lib/database/supabase";
import { 
  Client, 
  DevisLine, 
  Devis,
  DevisStatus,
  DevisCalculations 
} from "@/types";

export interface DevisCreateData {
  numero: string;
  client_id: string;
  date_creation: string; // Format YYYY-MM-DD
  date_validite: string; // Format YYYY-MM-DD
  lignes: DevisLine[];
  total_ht: number;
  total_tva: number;
  total_ttc: number;
  marge_globale_euros: number;
  marge_globale_pourcent: number;
  notes?: string;
}

export interface DevisStatsReturn {
  total: number;
  brouillons: number;
  envoyes: number;
  acceptes: number;
  refuses: number;
  chiffreAffaireMensuel: number;
  margeGlobaleMoyenne: number;
}

export interface DevisCreateData {
  numero: string;
  client_id: string;
  date_creation: string;
  date_validite: string;
  lignes: DevisLine[];
  total_ht: number;
  total_tva: number;
  total_ttc: number;
  marge_globale_euros: number;
  marge_globale_pourcent: number;
  notes?: string;
  created_by: string; // ✅ NOUVEAU - ID utilisateur créateur
}

/**
 * Repository pour gestion devis en Supabase
 * TYPES UNIFIÉS - Utilise les types centralisés
 */
export class DevisRepository {

  /**
   * Créer un nouveau devis avec ses lignes
   */
  static async createDevis(devisData: DevisCreateData): Promise<string> {
    try {
      // 1. Créer le devis principal avec created_by
      const { data: devisInserted, error: devisError } = await supabase
        .from('devis')
        .insert({
          numero: devisData.numero,
          client_id: devisData.client_id,
          date_creation: devisData.date_creation,
          date_validite: devisData.date_validite,
          status: 'brouillon',
          total_ht: devisData.total_ht,
          total_tva: devisData.total_tva,
          total_ttc: devisData.total_ttc,
          marge_globale_euros: devisData.marge_globale_euros,
          marge_globale_pourcent: devisData.marge_globale_pourcent,
          notes: devisData.notes,
          created_by: devisData.created_by, // ✅ TRAÇABILITÉ
          updated_by: devisData.created_by  // ✅ Même utilisateur au début
        })
        .select('id')
        .single();

      if (devisError) handleSupabaseError(devisError);

      const devisId = devisInserted.id;

      // 2. Créer les lignes de devis
      if (devisData.lignes.length > 0) {
        await this.saveLignesDevis(devisId, devisData.lignes);
      }

      console.log('✅ Devis créé par utilisateur:', devisData.created_by);
      return devisId;

    } catch (error) {
      console.error('❌ Erreur création devis:', error);
      throw error;
    }
  }

  /**
   * Sauvegarder les lignes d'un devis
   */
  static async saveLignesDevis(devisId: string, lignes: DevisLine[]): Promise<void> {
    try {
      // Supprimer les anciennes lignes
      await supabase
        .from('lignes_devis')
        .delete()
        .eq('devis_id', devisId);

      // Insérer les nouvelles lignes
      const lignesForDB = await Promise.all(
        lignes.map(async (ligne) => {
          // Récupérer l'ID du produit par son code
          const { data: produit } = await supabase
            .from('produits')
            .select('id')
            .eq('code', ligne.productCode)
            .single();

          return {
            devis_id: devisId,
            produit_id: produit?.id || null,
            quantite: ligne.quantite,
            prix_unitaire: ligne.prixUnitaire,
            prix_achat: ligne.prixAchat || 0,
            remise: ligne.remise,
            tva: ligne.tva,
            prix_apres_remise: ligne.prixApresRemise || ligne.prixUnitaire,
            total_ht: ligne.totalHT || 0,
            total_tva: ligne.totalTVA || 0,
            total_ttc: ligne.totalTTC || 0,
            marge_euros: ligne.margeEuros || 0,
            marge_pourcent: ligne.margePourcent || 0
          };
        })
      );

      const { error: lignesError } = await supabase
        .from('lignes_devis')
        .insert(lignesForDB);

      if (lignesError) handleSupabaseError(lignesError);

      console.log(`✅ ${lignes.length} lignes sauvegardées`);

    } catch (error) {
      console.error('❌ Erreur sauvegarde lignes:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour un devis existant
   */
  static async updateDevis(
    devisId: string, 
    devisData: Partial<DevisCreateData>,
    updatedBy: string // ✅ NOUVEAU - ID utilisateur modificateur
  ): Promise<void> {
    try {
      // 1. Mettre à jour le devis principal
      const updateData: any = { updated_by: updatedBy }; // ✅ Toujours tracer qui modifie
      
      if (devisData.date_creation) updateData.date_creation = devisData.date_creation;
      if (devisData.date_validite) updateData.date_validite = devisData.date_validite;
      if (devisData.total_ht !== undefined) updateData.total_ht = devisData.total_ht;
      if (devisData.total_tva !== undefined) updateData.total_tva = devisData.total_tva;
      if (devisData.total_ttc !== undefined) updateData.total_ttc = devisData.total_ttc;
      if (devisData.marge_globale_euros !== undefined) updateData.marge_globale_euros = devisData.marge_globale_euros;
      if (devisData.marge_globale_pourcent !== undefined) updateData.marge_globale_pourcent = devisData.marge_globale_pourcent;
      if (devisData.notes) updateData.notes = devisData.notes;

      const { error: updateError } = await supabase
        .from('devis')
        .update(updateData)
        .eq('id', devisId);

      if (updateError) handleSupabaseError(updateError);

      // 2. Mettre à jour les lignes si fournies
      if (devisData.lignes) {
        await this.saveLignesDevis(devisId, devisData.lignes);
      }

      console.log('✅ Devis mis à jour par utilisateur:', updatedBy);

    } catch (error) {
      console.error('❌ Erreur mise à jour devis:', error);
      throw error;
    }
  }

  /**
   * Récupérer un devis avec ses lignes
   */
  static async getDevisById(devisId: string): Promise<Devis | null> {
    try {
      // 1. Récupérer le devis avec client ET utilisateurs
      const { data: devisData, error: devisError } = await supabase
        .from('devis')
        .select(`
          *,
          clients(nom, siret),
          created_by_user:users!created_by(nom, prenom, role),
          updated_by_user:users!updated_by(nom, prenom, role)
        `)
        .eq('id', devisId)
        .single();

      if (devisError) {
        if (devisError.code === 'PGRST116') return null;
        handleSupabaseError(devisError);
      }

      // 2. Récupérer les lignes avec produits
      const { data: lignesData, error: lignesError } = await supabase
        .from('lignes_devis')
        .select(`
          *,
          produits(code, designation, colissage)
        `)
        .eq('devis_id', devisId)
        .order('created_at', { ascending: true });

      if (lignesError) handleSupabaseError(lignesError);

      // 3. Transformer pour l'interface avec types unifiés
      const lignes: DevisLine[] = (lignesData || []).map((ligne: any) => ({
        id: ligne.id,
        productCode: ligne.produits?.code || '',
        designation: ligne.produits?.designation || '',
        quantite: ligne.quantite,
        prixUnitaire: Number(ligne.prix_unitaire),
        prixAchat: Number(ligne.prix_achat),
        remise: Number(ligne.remise),
        tva: Number(ligne.tva),
        colissage: ligne.produits?.colissage,
        prixApresRemise: Number(ligne.prix_apres_remise),
        totalHT: Number(ligne.total_ht),
        totalTVA: Number(ligne.total_tva),
        totalTTC: Number(ligne.total_ttc),
        margeEuros: Number(ligne.marge_euros),
        margePourcent: Number(ligne.marge_pourcent)
      }));

      const devis: Devis = {
        id: devisData.id,
        numero: devisData.numero,
        date: new Date(devisData.date_creation),
        dateValidite: new Date(devisData.date_validite),
        clientId: devisData.client_id,
        clientNom: devisData.clients?.nom,
        lignes,
        status: devisData.status as DevisStatus,
        totalHT: Number(devisData.total_ht),
        totalTTC: Number(devisData.total_ttc),
        margeGlobale: Number(devisData.marge_globale_pourcent),
        notes: devisData.notes,
        createdAt: new Date(devisData.created_at),
        updatedAt: new Date(devisData.updated_at),
        // ✅ NOUVELLES PROPRIÉTÉS
        createdBy: devisData.created_by,
        createdByName: devisData.created_by_user ? 
          `${devisData.created_by_user.prenom || ''} ${devisData.created_by_user.nom}`.trim() : 
          'Utilisateur inconnu',
        updatedBy: devisData.updated_by,
        updatedByName: devisData.updated_by_user ? 
          `${devisData.updated_by_user.prenom || ''} ${devisData.updated_by_user.nom}`.trim() : 
          'Utilisateur inconnu'
      };

      return devis;

    } catch (error) {
      console.error('❌ Erreur récupération devis:', error);
      return null;
    }
  }


  /**
   * Récupérer tous les devis avec informations client
   */
  static async getAllDevis(): Promise<Devis[]> {
    try {
      const { data, error } = await supabase
        .from('devis')
        .select(`
          *,
          clients(nom),
          created_by_user:users!created_by(nom, prenom, role)
        `)
        .order('created_at', { ascending: false });

      if (error) handleSupabaseError(error);

      // Transformer pour l'interface avec informations créateur
      const devisList: Devis[] = (data || []).map((d: any) => ({
        id: d.id,
        numero: d.numero,
        date: new Date(d.date_creation),
        dateValidite: new Date(d.date_validite),
        clientId: d.client_id,
        clientNom: d.clients?.nom || 'Client inconnu',
        lignes: [],
        status: d.status as DevisStatus,
        totalHT: Number(d.total_ht || 0),
        totalTTC: Number(d.total_ttc || 0),
        margeGlobale: Number(d.marge_globale_pourcent || 0),
        notes: d.notes,
        createdAt: new Date(d.created_at),
        updatedAt: new Date(d.updated_at),
        // ✅ INFORMATIONS CRÉATEUR
        createdBy: d.created_by,
        createdByName: d.created_by_user ? 
          `${d.created_by_user.prenom || ''} ${d.created_by_user.nom}`.trim() : 
          'Utilisateur inconnu'
      }));

      return devisList;

    } catch (error) {
      console.error('❌ Erreur récupération devis:', error);
      return [];
    }
  }

  /**
   * Rechercher devis par terme
   */
  static async searchDevis(query: string): Promise<Devis[]> {
    try {
      const { data, error } = await supabase
        .from('devis')
        .select(`
          *,
          clients(nom)
        `)
        .or(`numero.ilike.%${query}%,clients.nom.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) handleSupabaseError(error);

      return (data || []).map((d: any) => ({
        id: d.id,
        numero: d.numero,
        date: new Date(d.date_creation),
        dateValidite: new Date(d.date_validite),
        clientId: d.client_id,
        clientNom: d.clients?.nom || 'Client inconnu',
        lignes: [],
        status: d.status as DevisStatus,
        totalHT: Number(d.total_ht || 0),
        totalTTC: Number(d.total_ttc || 0),
        margeGlobale: Number(d.marge_globale_pourcent || 0),
        notes: d.notes,
        createdAt: new Date(d.created_at),
        updatedAt: new Date(d.updated_at)
      }));

    } catch (error) {
      console.error('❌ Erreur recherche devis:', error);
      return [];
    }
  }

  /**
   * Supprimer un devis
   */
  static async deleteDevis(devisId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('devis')
        .delete()
        .eq('id', devisId);

      if (error) handleSupabaseError(error);
      
      console.log('✅ Devis supprimé de Supabase:', devisId);
      return true;

    } catch (error) {
      console.error('❌ Erreur suppression devis:', error);
      return false;
    }
  }

  /**
   * Statistiques des devis depuis Supabase
   */
  static async getDevisStats(): Promise<DevisStatsReturn> {
    try {
      const { data, error } = await supabase
        .from('devis')
        .select('status, total_ttc, marge_globale_pourcent, date_creation');

      if (error) handleSupabaseError(error);

      const allDevis = data || [];
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      const devisDuMois = allDevis.filter((d: any) => {
        const devisDate = new Date(d.date_creation);
        return devisDate.getMonth() === currentMonth && devisDate.getFullYear() === currentYear;
      });

      return {
        total: allDevis.length,
        brouillons: allDevis.filter((d: any) => d.status === 'brouillon').length,
        envoyes: allDevis.filter((d: any) => d.status === 'envoye').length,
        acceptes: allDevis.filter((d: any) => d.status === 'accepte').length,
        refuses: allDevis.filter((d: any) => d.status === 'refuse').length,
        chiffreAffaireMensuel: devisDuMois
          .filter((d: any) => d.status === 'accepte')
          .reduce((sum: any, d: any) => sum + Number(d.total_ttc || 0), 0),
        margeGlobaleMoyenne: allDevis.length > 0 
          ? allDevis.reduce((sum: any, d: any) => sum + Number(d.marge_globale_pourcent || 0), 0) / allDevis.length 
          : 0
      };

    } catch (error) {
      console.error('❌ Erreur stats devis:', error);
      return {
        total: 0,
        brouillons: 0,
        envoyes: 0,
        acceptes: 0,
        refuses: 0,
        chiffreAffaireMensuel: 0,
        margeGlobaleMoyenne: 0
      };
    }
  }

  /**
   * Dupliquer un devis existant
   */
  static async duplicateDevis(devisId: string): Promise<string | null> {
    try {
      console.log('🔄 Duplication devis:', devisId);
      
      // 1. Récupérer le devis original avec ses lignes
      const originalDevis = await this.getDevisById(devisId);
      
      if (!originalDevis) {
        throw new Error('Devis original introuvable');
      }

      console.log('✅ Devis original récupéré:', originalDevis.numero);

      // 2. Préparer les données pour la duplication
      const now = new Date();
      const nouveauNumero = this.generateNumeroDevis();
      
      const duplicatedDevisData: DevisCreateData = {
        created_by: originalDevis.createdBy || 'system',
        numero: nouveauNumero,
        client_id: originalDevis.clientId,
        date_creation: now.toISOString().split('T')[0],
        date_validite: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +30 jours
        lignes: originalDevis.lignes, // Lignes identiques
        total_ht: originalDevis.totalHT,
        total_tva: originalDevis.totalTTC - originalDevis.totalHT,
        total_ttc: originalDevis.totalTTC,
        marge_globale_euros: 0, // Recalculé automatiquement
        marge_globale_pourcent: originalDevis.margeGlobale,
        notes: `Copie de ${originalDevis.numero} - ${originalDevis.notes || ''}`.trim()
      };

      // 3. Créer le nouveau devis
      const newDevisId = await this.createDevis(duplicatedDevisData);
      
      console.log('✅ Devis dupliqué:', nouveauNumero, 'ID:', newDevisId);
      return newDevisId;

    } catch (error) {
      console.error('❌ Erreur duplication devis:', error);
      return null;
    }
  }

  static async duplicateDevisWithCurrentUser(devisId: string, currentUserId: string): Promise<string | null> {
  try {
    console.log('🔄 Duplication devis par utilisateur:', currentUserId);
    
    // 1. Récupérer le devis original avec ses lignes
    const originalDevis = await this.getDevisById(devisId);
    
    if (!originalDevis) {
      throw new Error('Devis original introuvable');
    }

    console.log('✅ Devis original récupéré:', originalDevis.numero);

    // 2. Préparer les données pour la duplication
    const now = new Date();
    const nouveauNumero = this.generateNumeroDevis();
    
    const duplicatedDevisData: DevisCreateData = {
      numero: nouveauNumero,
      client_id: originalDevis.clientId,
      date_creation: now.toISOString().split('T')[0],
      date_validite: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +30 jours
      lignes: originalDevis.lignes, // Lignes identiques
      total_ht: originalDevis.totalHT,
      total_tva: originalDevis.totalTTC - originalDevis.totalHT,
      total_ttc: originalDevis.totalTTC,
      marge_globale_euros: 0, // Recalculé automatiquement
      marge_globale_pourcent: originalDevis.margeGlobale,
      notes: `Copie de ${originalDevis.numero} - ${originalDevis.notes || ''}`.trim(),
      created_by: currentUserId // ✅ UTILISATEUR ACTUEL comme créateur de la copie
    };

    // 3. Créer le nouveau devis
    const newDevisId = await this.createDevis(duplicatedDevisData);
    
    console.log('✅ Devis dupliqué:', nouveauNumero, 'par utilisateur:', currentUserId);
    return newDevisId;

  } catch (error) {
    console.error('❌ Erreur duplication devis:', error);
    return null;
  }
}

  /**
   * Générer un numéro de devis unique
   */
  static generateNumeroDevis(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const sequence = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
    
    return `DEV${year}${month}${day}-${sequence}`;
  }

  
}