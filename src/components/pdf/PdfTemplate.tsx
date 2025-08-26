import { Page, Document, Text } from '@react-pdf/renderer';
import { pdfStyles } from '@/lib/pdf/pdfStyles';
import { PdfHeader } from './PdfHeader';
import { PdfClientInfo } from './PdfClientInfo';
import { PdfTable } from './PdfTable';
import { PdfFooter } from './PdfFooter';
import { Client, DevisLine, DevisCalculations } from '@/types';
import { PharmacieInfo } from '@/config/pharmacies'; // ✅ NOUVEAU: Import type PharmacieInfo

interface PdfTemplateProps {
  numeroDevis: string;
  dateCreation: Date;
  dateValidite: Date;
  client: Client;
  lignes: DevisLine[];
  calculations: DevisCalculations;
  pharmacie: PharmacieInfo; // ✅ NOUVEAU: Ajout de la pharmacie
  showNombreCartons?: boolean; // ✅ NOUVEAU: Option pour afficher les cartons
}

/**
 * Template PDF principal
 * Reproduction fidèle du devis existant
 */
export function PdfTemplate({
  numeroDevis,
  dateCreation,
  dateValidite,
  client,
  lignes,
  calculations,
  pharmacie, // ✅ NOUVEAU: Recevoir la pharmacie
  showNombreCartons = true // ✅ NOUVEAU: Valeur par défaut pour rétrocompatibilité
}: PdfTemplateProps) {
  
  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        {/* Header avec titre et infos devis */}
        <PdfHeader 
          numeroDevis={numeroDevis}
          dateCreation={dateCreation}
          dateValidite={dateValidite}
        />
        
        {/* Adresses entreprise et client avec pharmacie dynamique */}
        <PdfClientInfo 
          client={client} 
          pharmacie={pharmacie} // ✅ NOUVEAU: Passer la pharmacie
        />
        
        {/* Tableau des produits et totaux avec option cartons */}
        <PdfTable 
          lignes={lignes}
          calculations={calculations}
          showNombreCartons={showNombreCartons} // ✅ NOUVEAU: Passer l'option cartons
        />
        
        {/* Footer avec mentions légales de la pharmacie */}
        <PdfFooter pharmacie={pharmacie} /> {/* ✅ NOUVEAU: Passer la pharmacie */}
        
        {/* Numéro de page */}
        <Text style={pdfStyles.pageNumber}>
          Page: 1
        </Text>
      </Page>
    </Document>
  );
}