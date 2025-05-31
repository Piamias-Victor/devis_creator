import { View, Text } from '@react-pdf/renderer';
import { pdfStyles } from '@/lib/pdf/pdfStyles';

/**
 * Footer PDF avec mentions légales
 * Reproduction des mentions du devis original
 */
export function PdfFooter() {
  return (
    <View style={pdfStyles.footer}>
      <Text style={pdfStyles.footerText}>
        Pharmacie acceptant le règlement des sommes dues par chèque, libellé à son nom en sa qualité de membre d'un centre de gestion agréé par l'administration fiscale.
      </Text>
      
      <Text style={[pdfStyles.footerText, { marginTop: 5 }]}>
        202042131 PHARMACIE DU ROND POINT CORTE - 24 AVENUE DU 9 SEPTEMBRE - 20250 CORTE
      </Text>
      
      <Text style={[pdfStyles.footerText, { marginTop: 2 }]}>
        Siret: 98187961200019 - APE: 4773Z - IBAN : FR76 12006000158210814363707 BIC : AGRIFRPP820 - TVA Intracommunautaire : FR78981879612
      </Text>
    </View>
  );
}