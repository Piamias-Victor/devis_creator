import { DevisLine } from "@/types";
import { calculateLineTotal, calculateMarge } from "./devisUtils";

export interface MargeAnalysis {
  margeGlobaleEuros: number;
  margeGlobalePourcent: number;
  margeParLigne: Array<{
    id: string;
    designation: string;
    margeEuros: number;
    margePourcent: number;
    chiffreAffaire: number;
  }>;
  alertes: Array<{
    type: 'faible' | 'negative' | 'excellente';
    message: string;
    ligneId?: string;
  }>;
  statistiques: {
    margeMoyenne: number;
    meilleureMarge: number;
    pireMargeId: string;
    lignesRentables: number;
    totalPrixAchat: number;
    totalPrixVente: number;
  };
}

/**
 * Utilitaires avancés pour analyse des marges
 * Calculs détaillés + alertes + statistiques
 */
export class MargeUtils {
  
  /**
   * Analyse complète des marges d'un devis
   */
  static analyserMarges(lignes: DevisLine[]): MargeAnalysis {
    const margeParLigne = lignes.map(ligne => {
      const chiffreAffaire = calculateLineTotal(ligne.quantite, ligne.prixUnitaire, ligne.remise);
      
      if (!ligne.prixAchat) {
        return {
          id: ligne.id,
          designation: ligne.designation,
          margeEuros: 0,
          margePourcent: 0,
          chiffreAffaire
        };
      }
      
      const marge = calculateMarge(ligne.prixUnitaire, ligne.prixAchat);
      
      return {
        id: ligne.id,
        designation: ligne.designation,
        margeEuros: marge.margeEuros * ligne.quantite,
        margePourcent: marge.margePourcent,
        chiffreAffaire
      };
    });

    // Calculs globaux
    const totalPrixAchat = lignes.reduce((sum, ligne) => {
      if (!ligne.prixAchat) return sum;
      return sum + ligne.prixAchat * ligne.quantite;
    }, 0);

    const totalPrixVente = lignes.reduce((sum, ligne) => {
      return sum + calculateLineTotal(ligne.quantite, ligne.prixUnitaire, ligne.remise);
    }, 0);

    const margeGlobaleEuros = totalPrixVente - totalPrixAchat;
    const margeGlobalePourcent = totalPrixAchat > 0 ? (margeGlobaleEuros / totalPrixAchat) * 100 : 0;

    // Statistiques
    const margesValides = margeParLigne.filter(m => m.margePourcent > 0);
    const margeMoyenne = margesValides.length > 0 
      ? margesValides.reduce((sum, m) => sum + m.margePourcent, 0) / margesValides.length 
      : 0;

    const meilleureMarge = Math.max(...margeParLigne.map(m => m.margePourcent));
    const pireMargeObj = margeParLigne.reduce((prev, current) => 
      prev.margePourcent < current.margePourcent ? prev : current
    );

    const lignesRentables = margeParLigne.filter(m => m.margePourcent >= 15).length;

    // Génération des alertes
    const alertes = this.genererAlertes(margeParLigne, margeGlobalePourcent);

    return {
      margeGlobaleEuros,
      margeGlobalePourcent,
      margeParLigne,
      alertes,
      statistiques: {
        margeMoyenne,
        meilleureMarge,
        pireMargeId: pireMargeObj.id,
        lignesRentables,
        totalPrixAchat,
        totalPrixVente
      }
    };
  }

  /**
   * Génère des alertes selon les seuils de marge
   */
  private static genererAlertes(
    margeParLigne: MargeAnalysis['margeParLigne'], 
    margeGlobale: number
  ): MargeAnalysis['alertes'] {
    const alertes: MargeAnalysis['alertes'] = [];

    // Alerte marge globale
    if (margeGlobale < 5) {
      alertes.push({
        type: 'negative',
        message: 'Marge globale critique (< 5%)'
      });
    } else if (margeGlobale < 15) {
      alertes.push({
        type: 'faible',
        message: 'Marge globale faible (< 15%)'
      });
    } else if (margeGlobale > 40) {
      alertes.push({
        type: 'excellente',
        message: 'Excellente marge globale (> 40%)'
      });
    }

    // Alertes par ligne
    margeParLigne.forEach(ligne => {
      if (ligne.margePourcent < 0) {
        alertes.push({
          type: 'negative',
          message: `Marge négative sur "${ligne.designation}"`,
          ligneId: ligne.id
        });
      } else if (ligne.margePourcent < 10) {
        alertes.push({
          type: 'faible',
          message: `Marge très faible sur "${ligne.designation}" (${ligne.margePourcent.toFixed(1)}%)`,
          ligneId: ligne.id
        });
      }
    });

    return alertes;
  }

  /**
   * Recommandations d'optimisation
   */
  static genererRecommandations(analysis: MargeAnalysis): string[] {
    const recommandations: string[] = [];

    if (analysis.margeGlobalePourcent < 15) {
      recommandations.push("Augmenter les prix de vente ou négocier de meilleurs prix d'achat");
    }

    if (analysis.statistiques.lignesRentables < analysis.margeParLigne.length * 0.7) {
      recommandations.push("Plus de 30% des lignes ont une marge faible");
    }

    if (analysis.alertes.filter(a => a.type === 'negative').length > 0) {
      recommandations.push("Revoir urgement les lignes à marge négative");
    }

    return recommandations;
  }
}