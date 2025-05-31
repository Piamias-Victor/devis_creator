import { View, Text } from '@react-pdf/renderer';
import { pdfStyles } from '@/lib/pdf/pdfStyles';
import { Client } from '@/types';

interface PdfClientInfoProps {
  client: Client;
}

/**
 * Section adresses entreprise et client
 * Layout deux colonnes comme l'original
 */
export function PdfClientInfo({ client }: PdfClientInfoProps) {
  return (
    <View style={pdfStyles.addressSection}>
      {/* Entreprise émettrice (hardcodé) */}
      <View style={pdfStyles.addressBlock}>
        <Text style={pdfStyles.companyName}>
          PHARMACIE DU ROND POINT CORTE
        </Text>
        <Text style={pdfStyles.addressText}>M. ZUCCARELLI Jean-Marc</Text>
        <Text style={pdfStyles.addressText}>24 AVENUE DU 9 SEPTEMBRE</Text>
        <Text style={pdfStyles.addressText}>QUARTIER PORETTE</Text>
        <Text style={pdfStyles.addressText}>20250 CORTE</Text>
        <Text style={pdfStyles.addressText}>FRANCE</Text>
        <Text style={pdfStyles.addressText}>Tél : 04 95 46 08 95</Text>
        <Text style={pdfStyles.addressText}>Fax :</Text>
        <Text style={pdfStyles.addressText}>E-mail : contact@pharmaciedurondpointcorte.com</Text>
        <Text style={pdfStyles.addressText}>SIRET : 98187961200019 APE : 4773Z</Text>
        <Text style={pdfStyles.addressText}>TVA Intracommunautaire : FR78981879612</Text>
        <Text style={pdfStyles.addressText}>IBAN : FR76 12006000158210814363707 BIC : AGRIFRPP820</Text>
      </View>

      {/* Client destinataire */}
      <View style={pdfStyles.addressBlock}>
        <Text style={pdfStyles.companyName}>{client.nom}</Text>
        <Text style={pdfStyles.addressText}>{client.adresse}</Text>
        <Text style={pdfStyles.addressText}>Tél : {client.telephone}</Text>
        <Text style={pdfStyles.addressText}>E-mail : {client.email}</Text>
        <Text style={pdfStyles.addressText}>SIRET : {client.siret}</Text>
      </View>
    </View>
  );
}