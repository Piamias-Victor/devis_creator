/**
 * Configuration statique des pharmacies
 * Centralise toutes les informations des pharmacies pour les devis
 */

export interface PharmacieInfo {
  id: string;
  nom: string;
  responsable: string;
  adresse: {
    ligne1: string;
    ligne2?: string;
    ligne3?: string;
    codePostal: string;
    ville: string;
    pays: string;
  };
  contact: {
    telephone: string;
    fax?: string;
    email: string;
  };
  juridique: {
    siret: string;
    ape: string;
    tvaIntra: string;
  };
  bancaire: {
    iban: string;
    bic: string;
  };
  // Pour les mentions légales du PDF
  mentionLegale: string;
  numeroOrdre: string; // Ex: 202042131
}

export const PHARMACIES: Record<string, PharmacieInfo> = {
  'rond-point': {
    id: 'rond-point',
    nom: 'PHARMACIE DU ROND POINT CORTE',
    responsable: 'M. ZUCCARELLI Jean-Marc',
    adresse: {
      ligne1: '24 AVENUE DU 9 SEPTEMBRE',
      ligne2: 'QUARTIER PORETTE',
      codePostal: '20250',
      ville: 'CORTE',
      pays: 'FRANCE'
    },
    contact: {
      telephone: '04 95 46 08 95',
      fax: '',
      email: 'contact@pharmaciedurondpointcorte.com'
    },
    juridique: {
      siret: '98187961200019',
      ape: '4773Z',
      tvaIntra: 'FR78981879612'
    },
    bancaire: {
      iban: 'FR76 12006000158210814363707',
      bic: 'AGRIFRPP820'
    },
    mentionLegale: 'Pharmacie acceptant le règlement des sommes dues par chèque, libellé à son nom en sa qualité de membre d\'un centre de gestion agréé par l\'administration fiscale.',
    numeroOrdre: '202042131'
  },
  
  'salines': {
    id: 'salines',
    nom: 'GRANDE PHARMACIE DES SALINES',
    responsable: 'M. Adrien COUBARD',
    adresse: {
      ligne1: 'COURS DU PRINCE IMPERIAL',
      codePostal: '20090',
      ville: 'AJACCIO',
      pays: 'FRANCE'
    },
    contact: {
      telephone: '04 95 22 28 31', // À compléter avec le vrai numéro
      fax: '',
      email: 'contact@grandepharmaciedessalines.com' // À compléter avec le vrai email
    },
    juridique: {
      siret: '45387796100020',
      ape: '4773Z',
      tvaIntra: 'FR81453877961'
    },
    bancaire: {
      iban: 'FR76 30004014970001028965627', // À compléter avec les vraies coordonnées
      bic: 'BNPAFRPPXXX' // À compléter
    },
    mentionLegale: 'Pharmacie acceptant le règlement des sommes dues par chèque, libellé à son nom en sa qualité de membre d\'un centre de gestion agréé par l\'administration fiscale.',
    numeroOrdre: '202090XXX' // À compléter avec le numéro d'ordre
  }
};

// Helper pour récupérer une pharmacie par ID
export function getPharmacieById(id: string): PharmacieInfo {
  return PHARMACIES[id] || PHARMACIES['rond-point']; // Défaut sur Rond Point
}

// Helper pour avoir la liste des pharmacies pour les selects
export function getPharmaciesList() {
  return Object.values(PHARMACIES).map(p => ({
    value: p.id,
    label: p.nom
  }));
}