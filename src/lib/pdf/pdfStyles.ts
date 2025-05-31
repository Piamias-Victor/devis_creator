import { StyleSheet } from '@react-pdf/renderer';

/**
 * Styles PDF basés sur le devis existant
 * Reproduction fidèle du design original
 */
export const pdfStyles = StyleSheet.create({
  // Page et layout
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    padding: 20,
    backgroundColor: '#ffffff'
  },
  
  // Header principal
  headerMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderBottom: 2,
    borderBottomColor: '#000000',
    paddingBottom: 10
  },
  
  devisTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000'
  },
  
  devisInfo: {
    marginTop: 10
  },
  
  devisInfoRow: {
    flexDirection: 'row',
    marginBottom: 3
  },
  
  devisInfoLabel: {
    width: 80,
    fontWeight: 'bold'
  },
  
  // Entreprise et client
  addressSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30
  },
  
  addressBlock: {
    width: '45%'
  },
  
  companyName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5
  },
  
  addressText: {
    fontSize: 9,
    lineHeight: 1.4,
    marginBottom: 2
  },
  
  // Tableau
  table: {
    marginBottom: 20
  },
  
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderBottom: 1,
    borderBottomColor: '#000000',
    paddingVertical: 5,
    paddingHorizontal: 3
  },
  
  tableRow: {
    flexDirection: 'row',
    borderBottom: 0.5,
    borderBottomColor: '#cccccc',
    paddingVertical: 4,
    paddingHorizontal: 3,
    minHeight: 30
  },
  
  // Colonnes tableau - Largeurs proportionnelles
  colCode: { width: '8%', fontSize: 8 },
  colDesignation: { width: '35%', fontSize: 8 },
  colQty: { width: '6%', fontSize: 8, textAlign: 'center' },
  colPrixUnit: { width: '10%', fontSize: 8, textAlign: 'right' },
  colRemise: { width: '8%', fontSize: 8, textAlign: 'center' },
  colPrixNet: { width: '10%', fontSize: 8, textAlign: 'right' },
  colMontant: { width: '12%', fontSize: 8, textAlign: 'right' },
  colTVA: { width: '6%', fontSize: 8, textAlign: 'center' },
  
  // Headers colonnes
  headerText: {
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  
  // Totaux
  totalsSection: {
    marginTop: 20,
    alignItems: 'flex-end'
  },
  
  totalsTable: {
    width: 200,
    borderTop: 1,
    borderTopColor: '#000000'
  },
  
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderBottom: 0.5,
    borderBottomColor: '#cccccc'
  },
  
  totalRowFinal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
    fontSize: 11
  },
  
  totalLabel: {
    fontSize: 10,
    fontWeight: 'bold'
  },
  
  totalValue: {
    fontSize: 10,
    textAlign: 'right'
  },
  
  // Footer
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    borderTop: 1,
    borderTopColor: '#000000',
    paddingTop: 10
  },
  
  footerText: {
    fontSize: 8,
    textAlign: 'center',
    lineHeight: 1.3
  },
  
  // Pagination
  pageNumber: {
    position: 'absolute',
    bottom: 10,
    right: 20,
    fontSize: 8,
    color: '#666666'
  },
  
  // Styles texte
  bold: {
    fontWeight: 'bold'
  },
  
  center: {
    textAlign: 'center'
  },
  
  right: {
    textAlign: 'right'
  },
  
  // Quantité totale
  quantityTotal: {
    marginTop: 10,
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'right'
  }
});