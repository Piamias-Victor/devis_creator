import { View, Text } from '@react-pdf/renderer';
import { pdfStyles } from '@/lib/pdf/pdfStyles';

interface PdfHeaderProps {
  numeroDevis: string;
  dateCreation: Date;
  dateValidite: Date;
}

/**
 * Header PDF avec titre DEVIS et informations
 * Reproduction du style original
 */
export function PdfHeader({ numeroDevis, dateCreation, dateValidite }: PdfHeaderProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
  };

  return (
    <View style={pdfStyles.headerMain}>
      {/* Titre DEVIS */}
      <View>
        <Text style={pdfStyles.devisTitle}>DEVIS</Text>
      </View>
      
      {/* Informations devis */}
      <View style={pdfStyles.devisInfo}>
        <View style={pdfStyles.devisInfoRow}>
          <Text style={pdfStyles.devisInfoLabel}>Numéro</Text>
          <Text>{numeroDevis}</Text>
        </View>
        
        <View style={pdfStyles.devisInfoRow}>
          <Text style={pdfStyles.devisInfoLabel}>Date</Text>
          <Text>{formatDate(dateCreation)}</Text>
        </View>
        
        <View style={pdfStyles.devisInfoRow}>
          <Text style={pdfStyles.devisInfoLabel}>Date de validité</Text>
          <Text>{formatDate(dateValidite)}</Text>
        </View>
        
        <View style={pdfStyles.devisInfoRow}>
          <Text style={pdfStyles.devisInfoLabel}>Code client</Text>
          <Text>Page: 1</Text>
        </View>
      </View>
    </View>
  );
}