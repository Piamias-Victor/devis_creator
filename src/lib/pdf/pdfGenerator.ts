import { pdf } from '@react-pdf/renderer';
import { PdfTemplate } from '@/components/pdf/PdfTemplate';
import { Client, DevisLine, DevisCalculations } from '@/types';

interface GeneratePdfParams {
  numeroDevis: string;
  dateCreation: Date;
  dateValidite: Date;
  client: Client;
  lignes: DevisLine[];
  calculations: DevisCalculations;
}

/**
 * Générateur PDF principal
 * Crée et télécharge le PDF du devis
 */
export class PdfGenerator {
  
  /**
   * Génère et télécharge le PDF du devis
   */
  static async generateAndDownload({
    numeroDevis,
    dateCreation,
    dateValidite,
    client,
    lignes,
    calculations
  }: GeneratePdfParams): Promise<void> {
    
    try {
      // Créer le document PDF
      const document = PdfTemplate({
        numeroDevis,
        dateCreation,
        dateValidite,
        client,
        lignes,
        calculations
      });
      
      // Générer le blob PDF
      const blob = await pdf(document).toBlob();
      
      // Créer nom de fichier intelligent
      const fileName = this.generateFileName(numeroDevis, client.nom, dateCreation);
      
      // Télécharger le fichier
      this.downloadBlob(blob, fileName);
      
    } catch (error) {
      console.error('Erreur génération PDF:', error);
      throw new Error('Impossible de générer le PDF');
    }
  }
  
  /**
   * Génère un nom de fichier intelligent
   */
  private static generateFileName(numeroDevis: string, clientNom: string, date: Date): string {
    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
    const clientClean = clientNom.replace(/[^a-zA-Z0-9]/g, '_'); // Nettoie le nom
    
    return `Devis_${numeroDevis}_${clientClean}_${dateStr}.pdf`;
  }
  
  /**
   * Télécharge un blob comme fichier
   */
  private static downloadBlob(blob: Blob, fileName: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Libérer la mémoire
    URL.revokeObjectURL(url);
  }
  
  /**
   * Prévisualise le PDF (ouvre dans nouvel onglet)
   */
  static async preview(params: GeneratePdfParams): Promise<void> {
    try {
      const document = PdfTemplate(params);
      const blob = await pdf(document).toBlob();
      const url = URL.createObjectURL(blob);
      
      window.open(url, '_blank');
      
      // Nettoyer après 1 minute
      setTimeout(() => URL.revokeObjectURL(url), 60000);
      
    } catch (error) {
      console.error('Erreur prévisualisation PDF:', error);
      throw new Error('Impossible de prévisualiser le PDF');
    }
  }
}