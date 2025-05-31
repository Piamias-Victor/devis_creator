import { View, Text } from '@react-pdf/renderer';
import { pdfStyles } from '@/lib/pdf/pdfStyles';
import { DevisLine, DevisCalculations } from '@/types';
import { formatEuros } from '@/lib/utils/calculUtils';

interface PdfTableProps {
  lignes: DevisLine[];
  calculations: DevisCalculations;
}

/**
 * Tableau des produits PDF
 * Colonnes: Code | Réf | Désignation | Qté | HT U Brut | %Rem | HT U Net | Mt HT Net | %TVA
 */
export function PdfTable({ lignes, calculations }: PdfTableProps) {
  
  const formatPrice = (price: number) => {
    return price.toFixed(4).replace('.', ',');
  };

  const formatPriceEuros = (price: number) => {
    return price.toFixed(2).replace('.', ',');
  };

  return (
    <View style={pdfStyles.table}>
      {/* Header tableau */}
      <View style={pdfStyles.tableHeader}>
        <Text style={[pdfStyles.colCode, pdfStyles.headerText]}>Code</Text>
        <Text style={[pdfStyles.colCode, pdfStyles.headerText]}>Réf</Text>
        <Text style={[pdfStyles.colDesignation, pdfStyles.headerText]}>Désignation</Text>
        <Text style={[pdfStyles.colQty, pdfStyles.headerText]}>Qté</Text>
        <Text style={[pdfStyles.colPrixUnit, pdfStyles.headerText]}>HT U Brut</Text>
        <Text style={[pdfStyles.colRemise, pdfStyles.headerText]}>%Rem</Text>
        <Text style={[pdfStyles.colPrixNet, pdfStyles.headerText]}>HT U Net</Text>
        <Text style={[pdfStyles.colMontant, pdfStyles.headerText]}>Mt HT Net</Text>
        <Text style={[pdfStyles.colTVA, pdfStyles.headerText]}>%TVA</Text>
      </View>

      {/* Lignes produits */}
      {lignes.map((ligne, index) => (
        <View key={ligne.id} style={pdfStyles.tableRow}>
          <Text style={pdfStyles.colCode}>{ligne.productCode}</Text>
          <Text style={pdfStyles.colCode}></Text>
          <Text style={pdfStyles.colDesignation}>
            {ligne.designation}
            {ligne.colissage && (
              <Text>{'\n'}* {Math.ceil(ligne.quantite / ligne.colissage)} CARTONS</Text>
            )}
          </Text>
          <Text style={pdfStyles.colQty}>{ligne.quantite}</Text>
          <Text style={pdfStyles.colPrixUnit}>{formatPrice(ligne.prixUnitaire)}</Text>
          <Text style={pdfStyles.colRemise}>{formatPrice(ligne.remise)}</Text>
          <Text style={pdfStyles.colPrixNet}>{formatPrice(ligne.prixApresRemise || ligne.prixUnitaire)}</Text>
          <Text style={pdfStyles.colMontant}>{formatPriceEuros(ligne.totalHT || 0)}</Text>
          <Text style={pdfStyles.colTVA}>{ligne.tva.toFixed(1)}</Text>
        </View>
      ))}

      {/* Quantité totale */}
      <Text style={pdfStyles.quantityTotal}>
        Quantité totale des produits : {calculations.quantiteTotale}
      </Text>

      {/* Section totaux SIMPLIFIÉE */}
      <View style={pdfStyles.totalsSection}>
        {/* Tableau de ventilation par taux de TVA */}
        <Text style={[pdfStyles.totalLabel, { marginBottom: 10, fontSize: 11 }]}>
          Tableau de ventilation par taux de TVA
        </Text>
        
        <View style={[pdfStyles.totalsTable, { width: 250 }]}>
          <View style={pdfStyles.tableHeader}>
            <Text style={[pdfStyles.headerText, { width: 80, textAlign: 'center' }]}>Taux TVA</Text>
            <Text style={[pdfStyles.headerText, { width: 85, textAlign: 'right' }]}>HT Net</Text>
            <Text style={[pdfStyles.headerText, { width: 85, textAlign: 'right' }]}>TVA</Text>
          </View>
          
          <View style={pdfStyles.tableRow}>
            <Text style={{ width: 80, fontSize: 9, textAlign: 'center' }}>20,0%</Text>
            <Text style={{ width: 85, fontSize: 9, textAlign: 'right' }}>{formatPriceEuros(calculations.totalHT)}</Text>
            <Text style={{ width: 85, fontSize: 9, textAlign: 'right' }}>{formatPriceEuros(calculations.totalTVA)}</Text>
          </View>
          
          <View style={pdfStyles.totalRow}>
            <Text style={[pdfStyles.totalLabel, { width: 80, textAlign: 'center' }]}>Totaux</Text>
            <Text style={[pdfStyles.totalValue, { width: 85, textAlign: 'right' }]}>{formatPriceEuros(calculations.totalHT)}</Text>
            <Text style={[pdfStyles.totalValue, { width: 85, textAlign: 'right' }]}>{formatPriceEuros(calculations.totalTVA)}</Text>
          </View>
        </View>

        {/* Résumé final simplifié */}
        <View style={[pdfStyles.totalsTable, { marginTop: 15, width: 250 }]}>
          <View style={pdfStyles.totalRow}>
            <Text style={pdfStyles.totalLabel}>Total Net HT</Text>
            <Text style={pdfStyles.totalValue}>{formatPriceEuros(calculations.totalHT)} EUR</Text>
          </View>
          
          <View style={pdfStyles.totalRow}>
            <Text style={pdfStyles.totalLabel}>TVA</Text>
            <Text style={pdfStyles.totalValue}>{formatPriceEuros(calculations.totalTVA)} EUR</Text>
          </View>
          
          <View style={pdfStyles.totalRowFinal}>
            <Text style={[pdfStyles.totalLabel, { fontSize: 12 }]}>Montant TTC</Text>
            <Text style={[pdfStyles.totalValue, { fontSize: 12 }]}>
              {formatPriceEuros(calculations.totalTTC)} EUR
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}