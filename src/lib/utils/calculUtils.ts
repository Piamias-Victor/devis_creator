import { DevisLine, DevisCalculations } from "@/types";

/**
 * Moteur de calculs temps réel pour devis
 * Toutes les formules centralisées
 */

/**
 * Calcule tous les montants d'une ligne
 */
export function calculateLineAmounts(ligne: DevisLine): DevisLine {
  // Prix après remise
  const prixApresRemise = ligne.prixUnitaire * (1 - ligne.remise / 100);
  
  // Totaux ligne
  const totalHT = ligne.quantite * prixApresRemise;
  const totalTVA = totalHT * (ligne.tva / 100);
  const totalTTC = totalHT + totalTVA;
  
  // Calculs marge
  let margeEuros = 0;
  let margePourcent = 0;
  
  if (ligne.prixAchat && ligne.prixAchat > 0) {
    const margeUnitaire = prixApresRemise - ligne.prixAchat;
    margeEuros = margeUnitaire * ligne.quantite;
    margePourcent = (margeEuros / (ligne.prixAchat * ligne.quantite)) * 100;
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
 * Formatage
 */
export function formatEuros(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
}

export function formatPourcent(value: number): string {
  return `${value.toFixed(1)}%`;
}