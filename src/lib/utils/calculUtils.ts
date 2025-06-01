import { DevisLine, DevisCalculations } from "@/types";

/**
 * Moteur de calculs temps réel pour devis
 * MODIFIÉ - Gestion 4 décimales pour prix unitaires
 */

/**
 * Calcule tous les montants d'une ligne
 * Prix unitaires: 4 décimales / Totaux finaux: 2 décimales
 */
export function calculateLineAmounts(ligne: DevisLine): DevisLine {
  // Prix après remise (garder haute précision)
  const prixApresRemise = ligne.prixUnitaire * (1 - ligne.remise / 100);
  
  // Totaux ligne (calcul haute précision puis arrondi final)
  const totalHTBrut = ligne.quantite * prixApresRemise;
  const totalHT = Math.round(totalHTBrut * 100) / 100; // Arrondi final à 2 décimales
  
  const totalTVABrut = totalHT * (ligne.tva / 100);
  const totalTVA = Math.round(totalTVABrut * 100) / 100; // Arrondi final à 2 décimales
  
  const totalTTC = Math.round((totalHT + totalTVA) * 100) / 100; // Arrondi final
  
  // Calculs marge
  let margeEuros = 0;
  let margePourcent = 0;
  
  if (ligne.prixAchat && ligne.prixAchat > 0) {
    const margeUnitaireBrute = prixApresRemise - ligne.prixAchat;
    const margeEurosBrute = margeUnitaireBrute * ligne.quantite;
    margeEuros = Math.round(margeEurosBrute * 100) / 100; // Arrondi final
    
    const coutTotalAchat = ligne.prixAchat * ligne.quantite;
    margePourcent = coutTotalAchat > 0 ? (margeEuros / coutTotalAchat) * 100 : 0;
  }
  
  return {
    ...ligne,
    prixApresRemise,
    totalHT,
    totalTVA,
    totalTTC,
    margeEuros,
    margePourcent
  };
}

/**
 * Calcule les totaux du devis
 */
export function calculateDevisTotal(lignes: DevisLine[]): DevisCalculations {
  const totalHT = lignes.reduce((sum, ligne) => sum + (ligne.totalHT || 0), 0);
  const totalTVA = lignes.reduce((sum, ligne) => sum + (ligne.totalTVA || 0), 0);
  const totalTTC = totalHT + totalTVA;
  
  const margeGlobaleEuros = lignes.reduce((sum, ligne) => sum + (ligne.margeEuros || 0), 0);
  const totalPrixAchat = lignes.reduce((sum, ligne) => {
    return sum + (ligne.prixAchat ? ligne.prixAchat * ligne.quantite : 0);
  }, 0);
  
  const margeGlobalePourcent = totalPrixAchat > 0 ? (margeGlobaleEuros / totalPrixAchat) * 100 : 0;
  
  return {
    totalHT,
    totalTVA,
    totalTTC,
    margeGlobaleEuros,
    margeGlobalePourcent,
    nombreLignes: lignes.length,
    quantiteTotale: lignes.reduce((sum, ligne) => sum + ligne.quantite, 0)
  };
}

/**
 * Couleur marge selon seuils
 */
export function getMargeColorClass(margePourcent: number): {
  bg: string;
  text: string;
  label: string;
} {
  if (margePourcent < 8) {
    return {
      bg: "bg-red-500/20",
      text: "text-red-700 dark:text-red-300",
      label: "Critique"
    };
  } else if (margePourcent < 12) {
    return {
      bg: "bg-yellow-500/20",
      text: "text-yellow-700 dark:text-yellow-300",
      label: "Faible"
    };
  } else {
    return {
      bg: "bg-green-500/20",
      text: "text-green-700 dark:text-green-300",
      label: "Bonne"
    };
  }
}

/**
 * Formatage prix avec 4 décimales pour saisie
 */
export function formatPriceInput(amount: number): string {
  return amount.toFixed(4);
}

/**
 * Formatage prix unitaire pour affichage (4 décimales)
 */
export function formatPriceUnit(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 4,
    maximumFractionDigits: 4
  }).format(amount);
}

/**
 * Formatage prix final pour affichage (2 décimales)
 */
export function formatEuros(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Formatage pourcentage
 */
export function formatPourcent(value: number): string {
  return `${value.toFixed(1)}%`;
}

/**
 * Parse prix depuis string avec validation 4 décimales
 */
export function parsePriceInput(value: string): number {
  const cleaned = value.replace(',', '.');
  const parsed = parseFloat(cleaned);
  
  if (isNaN(parsed) || parsed < 0) return 0;
  
  // Limiter à 4 décimales max
  return Math.round(parsed * 10000) / 10000;
}