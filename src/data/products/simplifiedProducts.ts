import { ProductCreateInput } from "@/types/product";

/**
 * Base de données produits SIMPLIFIÉE
 * Structure: code, designation, prixAchat, tva, colissage
 * Prix vente calculé automatiquement avec marge 10%
 */
export const SIMPLIFIED_PRODUCTS: ProductCreateInput[] = [
  // Molicare Premium FIXPANTS
  {
    code: "4052199274621",
    designation: "MoliCare® Premium Fixpants Long Leg B3 - S",
    prixAchat: 0.86,
    tva: 20,
    colissage: 20
  },
  {
    code: "4052199274652", 
    designation: "MoliCare® Premium Fixpants Long Leg B3 - M",
    prixAchat: 0.86,
    tva: 20,
    colissage: 20
  },
  {
    code: "4052199274683",
    designation: "MoliCare® Premium Fixpants Long Leg B3 - L", 
    prixAchat: 0.86,
    tva: 20,
    colissage: 20
  },
  {
    code: "4052199274713",
    designation: "MoliCare® Premium Fixpants Long Leg B3 - XL",
    prixAchat: 0.86,
    tva: 20,
    colissage: 20
  },
  {
    code: "4052199267692",
    designation: "MoliCare® Premium FIXPANTS S longleg - Bte de 25",
    prixAchat: 0.36,
    tva: 20,
    colissage: 8
  },
  {
    code: "4052199267722",
    designation: "MoliCare® Premium FIXPANTS M longleg - Bte de 25", 
    prixAchat: 0.37,
    tva: 20,
    colissage: 8
  },
  {
    code: "4052199267753",
    designation: "MoliCare® Premium FIXPANTS L longleg - Bte de 25",
    prixAchat: 0.38,
    tva: 20,
    colissage: 8
  },
  {
    code: "4052199267784",
    designation: "MoliCare® Premium FIXPANTS XL longleg - Bte de 25",
    prixAchat: 0.42,
    tva: 20,
    colissage: 8
  },
  {
    code: "4052199289557",
    designation: "Molicare® Premium LADY pad 0,5G",
    prixAchat: 0.06,
    tva: 20,
    colissage: 8
  },
  {
    code: "4052199293325",
    designation: "Molicare® Premium LADY pad 2G",
    prixAchat: 0.16,
    tva: 20,
    colissage: 18
  },
  {
    code: "4052199290553",
    designation: "Molicare® Premium LADY pad 3G",
    prixAchat: 0.17,
    tva: 20,
    colissage: 12
  },
  {
    code: "4052199275246",
    designation: "Molicare® Premium MOBILE 5G S",
    prixAchat: 0.47,
    tva: 20,
    colissage: 4
  },
  {
    code: "4052199275277",
    designation: "Molicare® Premium MOBILE 5G M",
    prixAchat: 0.47,
    tva: 20,
    colissage: 3
  },
  {
    code: "4052199275307",
    designation: "Molicare® Premium MOBILE 5G L",
    prixAchat: 0.53,
    tva: 20,
    colissage: 4
  },
  {
    code: "4052199275390",
    designation: "Molicare® Premium MOBILE 6G S",
    prixAchat: 0.61,
    tva: 20,
    colissage: 4
  },
  {
    code: "4052199275420",
    designation: "Molicare® Premium MOBILE 6G M",
    prixAchat: 0.64,
    tva: 20,
    colissage: 3
  },
  {
    code: "4052199275451",
    designation: "Molicare® Premium MOBILE 6G L",
    prixAchat: 0.70,
    tva: 20,
    colissage: 4
  },
  {
    code: "4052199296975",
    designation: "Molicare® Premium Elastic 6 Gouttes S",
    prixAchat: 0.30,
    tva: 20,
    colissage: 3
  },
  {
    code: "4052199297002",
    designation: "Molicare® Premium Elastic 6 Gouttes M",
    prixAchat: 0.31,
    tva: 20,
    colissage: 3
  },
  {
    code: "4052199297033",
    designation: "Molicare® Premium Elastic 6 Gouttes L",
    prixAchat: 0.41,
    tva: 20,
    colissage: 3
  },
  {
    code: "4052199297248",
    designation: "Molicare® Premium Elastic 8G M",
    prixAchat: 0.38,
    tva: 20,
    colissage: 3
  },
  {
    code: "4052199505374",
    designation: "Molicare® Premium Bed Mat 7 gouttes 60X90 cm",
    prixAchat: 0.20,
    tva: 20,
    colissage: 4
  },
  {
    code: "4052199508603",
    designation: "Molicare® Premium Bed Mat 8 gouttes 60X90 cm",
    prixAchat: 0.22,
    tva: 20,
    colissage: 4
  },
  // Produits Seni
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