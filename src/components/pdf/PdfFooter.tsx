import { View, Text } from '@react-pdf/renderer';
import { pdfStyles } from '@/lib/pdf/pdfStyles';
import { PharmacieInfo } from '@/config/pharmacies'; // ✅ NOUVEAU: Import type PharmacieInfo

interface PdfFooterProps {
  pharmacie: PharmacieInfo; // ✅ NOUVEAU: Ajout de la pharmacie
}

/**
 * Footer PDF avec mentions légales dynamiques
 */
export function PdfFooter({ pharmacie }: PdfFooterProps) {
  return (
    <View style={pdfStyles.footer}>
      <Text style={pdfStyles.footerText}>
        {pharmacie.mentionLegale}
      </Text>
      
      <Text style={[pdfStyles.footerText, { marginTop: 5 }]}>
        {pharmacie.numeroOrdre} {pharmacie.nom} - {pharmacie.adresse.ligne1} - {pharmacie.adresse.codePostal} {pharmacie.adresse.ville}
      </Text>
      
      <Text style={[pdfStyles.footerText, { marginTop: 2 }]}>
        Siret: {pharmacie.juridique.siret} - APE: {pharmacie.juridique.ape} - 
        IBAN : {pharmacie.bancaire.iban} BIC : {pharmacie.bancaire.bic} - 
        TVA Intracommunautaire : {pharmacie.juridique.tvaIntra}
      </Text>
    </View>
  );
}