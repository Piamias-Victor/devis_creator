import { DevisLine, DevisCalculations } from "@/types";

/**
 * Moteur de calculs temps réel pour devis
 * CORRIGÉ - Gestion précise des arrondis pour éviter les variations de marge
 */

/**
 * Calcule tous les montants d'une ligne
 * CORRIGÉ - Calcul marge sur totaux bruts pour éviter erreurs d'arrondi
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
  
  // Calculs marge CORRIGÉS - utiliser les valeurs brutes
  let margeEuros = 0;
  let margePourcent = 0;
  
  if (ligne.prixAchat && ligne.prixAchat > 0) {
    // CORRECTION: Utiliser les valeurs BRUTES pour le calcul de marge
    const margeUnitaireBrute = prixApresRemise - ligne.prixAchat;
    const margeEurosBrute = margeUnitaireBrute * ligne.quantite;
    margeEuros = Math.round(margeEurosBrute * 100) / 100; // Arrondi final seulement
    
    // CORRECTION: Calcul pourcentage sur coût total BRUT
    const coutTotalAchatBrut = ligne.prixAchat * ligne.quantite;
    margePourcent = coutTotalAchatBrut > 0 ? (margeEurosBrute / coutTotalAchatBrut) * 100 : 0;
    // Arrondi final du pourcentage à 1 décimale
    margePourcent = Math.round(margePourcent * 10) / 10;
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
 * CORRIGÉ - Recalcul marge globale pour cohérence
 */
export function calculateDevisTotal(lignes: DevisLine[]): DevisCalculations {
  // Totaux des montants (utilisent les valeurs déjà arrondies)
  const totalHT = lignes.reduce((sum, ligne) => sum + (ligne.totalHT || 0), 0);
  const totalTVA = lignes.reduce((sum, ligne) => sum + (ligne.totalTVA || 0), 0);
  const totalTTC = totalHT + totalTVA;
  
  // CORRECTION: Recalcul marge globale avec précision maximale
  let margeGlobaleBrute = 0;
  let totalPrixAchatBrut = 0;
  
  for (const ligne of lignes) {
    if (ligne.prixAchat && ligne.prixAchat > 0) {
      const prixApresRemise = ligne.prixUnitaire * (1 - ligne.remise / 100);
      const margeUnitaire = prixApresRemise - ligne.prixAchat;
      
      // Accumulation SANS arrondi intermédiaire
      margeGlobaleBrute += margeUnitaire * ligne.quantite;
      totalPrixAchatBrut += ligne.prixAchat * ligne.quantite;
    }
  }
  
  // Marge globale avec arrondi final
  const margeGlobaleEuros = Math.round(margeGlobaleBrute * 100) / 100;
  const margeGlobalePourcent = totalPrixAchatBrut > 0 
    ? Math.round((margeGlobaleBrute / totalPrixAchatBrut) * 1000) / 10   // ✅ CORRECT
    : 0;
  
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