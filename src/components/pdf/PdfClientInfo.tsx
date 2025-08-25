import { View, Text } from '@react-pdf/renderer';
import { pdfStyles } from '@/lib/pdf/pdfStyles';
import { Client } from '@/types';
import { PharmacieInfo } from '@/config/pharmacies'; // ✅ NOUVEAU: Import type PharmacieInfo

interface PdfClientInfoProps {
  client: Client;
  pharmacie: PharmacieInfo; // ✅ NOUVEAU: Ajout de la pharmacie
}

/**
 * Section adresses entreprise et client
 * Layout deux colonnes avec pharmacie dynamique
 */
export function PdfClientInfo({ client, pharmacie }: PdfClientInfoProps) {
  return (
    <View style={pdfStyles.addressSection}>
      {/* Entreprise émettrice (dynamique) */}
      <View style={pdfStyles.addressBlock}>
        <Text style={pdfStyles.companyName}>
          {pharmacie.nom}
        </Text>
        <Text style={pdfStyles.addressText}>{pharmacie.responsable}</Text>
        <Text style={pdfStyles.addressText}>{pharmacie.adresse.ligne1}</Text>
        {pharmacie.adresse.ligne2 && (
          <Text style={pdfStyles.addressText}>{pharmacie.adresse.ligne2}</Text>
        )}
        {pharmacie.adresse.ligne3 && (
          <Text style={pdfStyles.addressText}>{pharmacie.adresse.ligne3}</Text>
        )}
        <Text style={pdfStyles.addressText}>
          {pharmacie.adresse.codePostal} {pharmacie.adresse.ville}
        </Text>
        <Text style={pdfStyles.addressText}>{pharmacie.adresse.pays}</Text>
        <Text style={pdfStyles.addressText}>Tél : {pharmacie.contact.telephone}</Text>
        {pharmacie.contact.fax && (
          <Text style={pdfStyles.addressText}>Fax : {pharmacie.contact.fax}</Text>
        )}
        <Text style={pdfStyles.addressText}>E-mail : {pharmacie.contact.email}</Text>
        <Text style={pdfStyles.addressText}>
          SIRET : {pharmacie.juridique.siret} APE : {pharmacie.juridique.ape}
        </Text>
        <Text style={pdfStyles.addressText}>
          TVA Intracommunautaire : {pharmacie.juridique.tvaIntra}
        </Text>
        <Text style={pdfStyles.addressText}>
          IBAN : {pharmacie.bancaire.iban} BIC : {pharmacie.bancaire.bic}
        </Text>
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