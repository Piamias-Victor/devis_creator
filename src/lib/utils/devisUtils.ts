/**
 * Utilitaires pour la gestion des devis
 * Génération numéros, calculs, formatage
 */

/**
 * Génère un numéro de devis unique
 * Format: YYYY-MMDD-XXXX (année-mois/jour-séquentiel)
 */
export function generateDevisNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const sequence = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
  
  return `${year}-${month}${day}-${sequence}`;
}

/**
 * Calcule la date de validité (30 jours par défaut)
 */
export function calculateValidityDate(dateCreation: Date = new Date(), daysValid: number = 30): Date {
  const validityDate = new Date(dateCreation);
  validityDate.setDate(validityDate.getDate() + daysValid);
  return validityDate;
}

/**
 * Formate un prix en euros
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
}

/**
 * Formate un pourcentage
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

/**
 * Calcule le total HT d'une ligne de devis
 */
export function calculateLineTotal(quantite: number, prixUnitaire: number, remise: number = 0): number {
  const totalBrut = quantite * prixUnitaire;
  const remiseAmount = totalBrut * (remise / 100);
  return totalBrut - remiseAmount;
}

/**
 * Calcule la TVA sur un montant
 */
export function calculateTVA(montantHT: number, tauxTVA: number = 20): number {
  return montantHT * (tauxTVA / 100);
}

/**
 * Calcule la marge en euros et pourcentage
 */
export function calculateMarge(prixVente: number, prixAchat: number): { 
  margeEuros: number; 
  margePourcent: number 
} {
  const margeEuros = prixVente - prixAchat;
  const margePourcent = prixAchat > 0 ? (margeEuros / prixAchat) * 100 : 0;
  
  return { margeEuros, margePourcent };
}