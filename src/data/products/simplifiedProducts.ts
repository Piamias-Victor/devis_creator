import { ProductCreateInput } from "@/types/product";

/**
 * Base de données produits ÉTENDUE
 * Structure: code, designation, prixAchat, tva, colissage
 * Prix vente calculé automatiquement avec marge 10%
 */
export const SIMPLIFIED_PRODUCTS: ProductCreateInput[] = [
  // Molicare Premium FIXPANTS (produits existants)
  {
    code: "4052199274621",
    designation: "MoliCare Premium Fixpants Long Leg B3 - S",
    prixAchat: 0.86,
    tva: 20,
    colissage: 20
  },
  {
    code: "4052199274652", 
    designation: "MoliCare Premium Fixpants Long Leg B3 - M",
    prixAchat: 0.86,
    tva: 20,
    colissage: 20
  },
  {
    code: "4052199274683",
    designation: "MoliCare Premium Fixpants Long Leg B3 - L", 
    prixAchat: 0.86,
    tva: 20,
    colissage: 20
  },
  {
    code: "4052199274713",
    designation: "MoliCare Premium Fixpants Long Leg B3 - XL",
    prixAchat: 0.86,
    tva: 20,
    colissage: 20
  },
  {
    code: "4052199267692",
    designation: "MoliCare Premium FIXPANTS S longleg - Bte de 25",
    prixAchat: 0.36,
    tva: 20,
    colissage: 8
  },
  {
    code: "4052199267722",
    designation: "MoliCare Premium FIXPANTS M longleg - Bte de 25", 
    prixAchat: 0.37,
    tva: 20,
    colissage: 8
  },
  {
    code: "4052199267753",
    designation: "MoliCare Premium FIXPANTS L longleg - Bte de 25",
    prixAchat: 0.38,
    tva: 20,
    colissage: 8
  },
  {
    code: "4052199267784",
    designation: "MoliCare Premium FIXPANTS XL longleg - Bte de 25",
    prixAchat: 0.42,
    tva: 20,
    colissage: 8
  },
  {
    code: "4052199289557",
    designation: "Molicare Premium LADY pad 0,5G",
    prixAchat: 0.06,
    tva: 20,
    colissage: 8
  },
  {
    code: "4052199293325",
    designation: "Molicare Premium LADY pad 2G",
    prixAchat: 0.16,
    tva: 20,
    colissage: 18
  },
  {
    code: "4052199290553",
    designation: "Molicare Premium LADY pad 3G",
    prixAchat: 0.17,
    tva: 20,
    colissage: 12
  },
  {
    code: "4052199275246",
    designation: "Molicare Premium MOBILE 5G S",
    prixAchat: 0.47,
    tva: 20,
    colissage: 4
  },
  {
    code: "4052199275277",
    designation: "Molicare Premium MOBILE 5G M",
    prixAchat: 0.47,
    tva: 20,
    colissage: 3
  },
  {
    code: "4052199275307",
    designation: "Molicare Premium MOBILE 5G L",
    prixAchat: 0.53,
    tva: 20,
    colissage: 4
  },
  {
    code: "4052199275390",
    designation: "Molicare Premium MOBILE 6G S",
    prixAchat: 0.61,
    tva: 20,
    colissage: 4
  },
  {
    code: "4052199275420",
    designation: "Molicare Premium MOBILE 6G M",
    prixAchat: 0.64,
    tva: 20,
    colissage: 3
  },
  {
    code: "4052199275451",
    designation: "Molicare Premium MOBILE 6G L",
    prixAchat: 0.70,
    tva: 20,
    colissage: 4
  },
  {
    code: "4052199296975",
    designation: "Molicare Premium Elastic 6 Gouttes S",
    prixAchat: 0.30,
    tva: 20,
    colissage: 3
  },
  {
    code: "4052199297002",
    designation: "Molicare Premium Elastic 6 Gouttes M",
    prixAchat: 0.31,
    tva: 20,
    colissage: 3
  },
  {
    code: "4052199297033",
    designation: "Molicare Premium Elastic 6 Gouttes L",
    prixAchat: 0.41,
    tva: 20,
    colissage: 3
  },
  {
    code: "4052199297248",
    designation: "Molicare Premium Elastic 8G M",
    prixAchat: 0.38,
    tva: 20,
    colissage: 3
  },
  {
    code: "4052199505374",
    designation: "Molicare Premium Bed Mat 7 gouttes 60X90 cm",
    prixAchat: 0.20,
    tva: 20,
    colissage: 4
  },
  {
    code: "4052199508603",
    designation: "Molicare Premium Bed Mat 8 gouttes 60X90 cm",
    prixAchat: 0.22,
    tva: 20,
    colissage: 4
  },
  // Produits Seni (existants)
  {
    code: "SE-096-SM30-AC1",
    designation: "Seni Active Classic Small - 30 pièces",
    prixAchat: 0.53,
    tva: 20,
    colissage: 4
  },
  {
    code: "SE-096-ME30-AC1",
    designation: "Seni Active Classic Medium - 30 pièces",
    prixAchat: 0.50,
    tva: 20,
    colissage: 4
  },
  {
    code: "SE-094-SM30-CB1",
    designation: "Seni Classic Basic Small - 30 pièces",
    prixAchat: 0.32,
    tva: 20,
    colissage: 3
  },
  {
    code: "SE-091-SB25-D03",
    designation: "Seni Soft Basic 90x60 cm - 25 pièces",
    prixAchat: 0.27,
    tva: 20,
    colissage: 4
  },

  // NOUVEAUX PRODUITS INTÉGRÉS
  // Bavoirs et gants
  {
    code: "1408090002",
    designation: "Bavoirs jetables 2 plis 38*68 cm",
    prixAchat: 0.0699,
    tva: 20,
    colissage: 600
  },
  {
    code: "1106036001",
    designation: "Gants jetables Nitrile T6/7 S",
    prixAchat: 0.0263,
    tva: 20,
    colissage: 2000
  },
  {
    code: "1106037001",
    designation: "Gants jetables Nitrile T7/8 M",
    prixAchat: 0.0263,
    tva: 20,
    colissage: 2000
  },
  {
    code: "11060338001",
    designation: "Gants jetables Nitrile T8/9 L",
    prixAchat: 0.0263,
    tva: 20,
    colissage: 2000
  },
  // Molicare Premium Elastic - Nouvelle gamme
  {
    code: "165273",
    designation: "Molicare Premium Elastic 6G L",
    prixAchat: 0.41,
    tva: 20,
    colissage: 90
  },
  {
    code: "165272",
    designation: "Molicare Premium Elastic 6G M",
    prixAchat: 0.31,
    tva: 20,
    colissage: 90
  },
  {
    code: "165271",
    designation: "Molicare Premium Elastic 6G S",
    prixAchat: 0.30,
    tva: 20,
    colissage: 90
  },
  {
    code: "165274",
    designation: "Molicare Premium Elastic 6G XL",
    prixAchat: 0.55,
    tva: 20,
    colissage: 56
  },
  {
    code: "16473",
    designation: "Molicare Premium Elastic 8G L",
    prixAchat: 0.46,
    tva: 20,
    colissage: 72
  },
  {
    code: "915873",
    designation: "Molicare Premium Elastic 8G L",
    prixAchat: 0.80,
    tva: 20,
    colissage: 56
  },
  {
    code: "165472",
    designation: "Molicare Premium Elastic 8G M",
    prixAchat: 0.38,
    tva: 20,
    colissage: 78
  },
  {
    code: "165471",
    designation: "Molicare Premium Elastic 8G S",
    prixAchat: 0.37,
    tva: 20,
    colissage: 78
  },
  {
    code: "165474",
    designation: "Molicare Premium Elastic 8G XL",
    prixAchat: 0.64,
    tva: 20,
    colissage: 56
  },
  {
    code: "915874",
    designation: "Molicare Premium Elastic 8G XL",
    prixAchat: 0.91,
    tva: 20,
    colissage: 56
  },
  // Molicare Premium Mobile - Nouvelle gamme
  {
    code: "915833",
    designation: "Molicare Premium Mobile 6G L",
    prixAchat: 0.70,
    tva: 20,
    colissage: 56
  },
  {
    code: "915832",
    designation: "Molicare Premium Mobile 6G M",
    prixAchat: 0.64,
    tva: 20,
    colissage: 42
  },
  {
    code: "915831",
    designation: "Molicare Premium Mobile 6G S",
    prixAchat: 0.61,
    tva: 20,
    colissage: 56
  },
  {
    code: "915834",
    designation: "Molicare Premium Mobile 6G XL",
    prixAchat: 0.80,
    tva: 20,
    colissage: 56
  },
  {
    code: "915872",
    designation: "Molicare Premium Mobile 8G M",
    prixAchat: 0.74,
    tva: 20,
    colissage: 42
  },
  {
    code: "915871",
    designation: "Molicare Premium Mobile 8G S",
    prixAchat: 0.71,
    tva: 20,
    colissage: 56
  },
  // Molicare Bed Mat - Nouvelle référence
  {
    code: "161088",
    designation: "Molicare Premium Bed Mat 8 gouttes 60X90 cm",
    prixAchat: 0.22,
    tva: 20,
    colissage: 120
  },
  // Seni Active Classic - Gamme étendue
  {
    code: "E-096-LA30-AC1",
    designation: "Seni Active Classic Large Pants (6G)",
    prixAchat: 0.55,
    tva: 20,
    colissage: 90
  },
  {
    code: "E-094-XL30-AC1",
    designation: "Seni Active Classic XL Pants (6G)",
    prixAchat: 0.65,
    tva: 20,
    colissage: 90
  },
  // Seni Alèses
  {
    code: "E-091-SB25-D03",
    designation: "Seni Alèses Soft Basic 60*90",
    prixAchat: 0.27,
    tva: 20,
    colissage: 50
  },
  // Seni Classic Basic - Gamme complète
  {
    code: "E-094-LA30-CB1",
    designation: "Seni Classic Basic Large Chang complet (6G)",
    prixAchat: 0.45,
    tva: 20,
    colissage: 90
  },
  {
    code: "E094-ME30-CB1",
    designation: "Seni Classic Basic Medium Chang complet (6G)",
    prixAchat: 0.39,
    tva: 20,
    colissage: 90
  },
  {
    code: "SE-06-K_LA30 -CB1",
    designation: "Seni Classic Basic Small Chang complet (6G)",
    prixAchat: 0.32,
    tva: 20,
    colissage: 60
  },
  {
    code: "E-094- XL-CB1",
    designation: "Seni Classic Basic X large Chang complet (6G)",
    prixAchat: 0.48,
    tva: 20,
    colissage: 90
  },
  // Seni Classic Plus - Gamme 8G
  {
    code: "E-094-LA390- CP2",
    designation: "Seni Classic plus L Chang complet (8G)",
    prixAchat: 0.50,
    tva: 20,
    colissage: 90
  },
  {
    code: "E-094-ME30-CP2",
    designation: "Seni Classic plus M Chang complet (8G)",
    prixAchat: 0.42,
    tva: 20,
    colissage: 90
  },
  {
    code: "E094-SM30-SC2",
    designation: "Seni Classic plus S Chang complet (8G)",
    prixAchat: 0.35,
    tva: 20,
    colissage: 90
  },
  {
    code: "E094-XL30-SC2",
    designation: "Seni Classic plus XL Chang complet (8G)",
    prixAchat: 0.53,
    tva: 20,
    colissage: 90
  },
  // Seni Super Plus
  {
    code: "E-091-2X10-G02",
    designation: "Seni Super Plus XXL Change complet",
    prixAchat: 0.78,
    tva: 20,
    colissage: 60
  },
  // Valaclean
  {
    code: "VALA-GANTS-001",
    designation: "Valaclean gants toilette collectivité",
    prixAchat: 0.0246,
    tva: 20,
    colissage: 1200
  },

  {
    code: "E094-XL30-SC2",
    designation: "Seni Classic plus XL Chang complet (8G)",
    prixAchat: 0.0530,
    tva: 20,
    colissage: 90
  }
];


/**
 * Configuration par défaut pour nouveaux produits
 */
export const PRODUCT_DEFAULTS = {
  tva: 20,           // TVA 20% par défaut
  colissage: 1,      // Colissage unitaire par défaut
  margeDefaut: 10    // Marge 10% par défaut
} as const;