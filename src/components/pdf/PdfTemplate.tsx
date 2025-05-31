import { Page, Document, Text } from '@react-pdf/renderer';
import { pdfStyles } from '@/lib/pdf/pdfStyles';
import { PdfHeader } from './PdfHeader';
import { PdfClientInfo } from './PdfClientInfo';
import { PdfTable } from './PdfTable';
import { PdfFooter } from './PdfFooter';
import { Client, DevisLine, DevisCalculations } from '@/types';

interface PdfTemplateProps {
  numeroDevis: string;
  dateCreation: Date;
  dateValidite: Date;
  client: Client;
  lignes: DevisLine[];
  calculations: DevisCalculations;
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
  calculations
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
        
        {/* Adresses entreprise et client */}
        <PdfClientInfo client={client} />
        
        {/* Tableau des produits et totaux */}
        <PdfTable 
          lignes={lignes}
          calculations={calculations}
        />
        
        {/* Footer avec mentions légales */}
        <PdfFooter />
        
        {/* Numéro de page */}
        <Text style={pdfStyles.pageNumber}>
          Page: 1
        </Text>
      </Page>
    </Document>
  );
}