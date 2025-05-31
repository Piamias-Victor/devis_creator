import { Product } from "@/types";

/**
 * Base de données produits hardcodée
 * Basée sur le devis réel fourni
 */
export const MOCK_PRODUCTS: Product[] = [
  // Produits d'incontinence
  {
    code: "MOLI-8G-XL",
    designation: "MOLICARE PREMIUM ELASTIC 8G XL",
    prixAchat: 0.42,
    prixVente: 0.525,
    unite: "pièce",
    categorie: "Incontinence",
    colissage: 72,
    tva: 20
  },
  {
    code: "MOLI-8G-L",
    designation: "MOLICARE PREMIUM ELASTIC 8G L",
    prixAchat: 0.40,
    prixVente: 0.50,
    unite: "pièce", 
    categorie: "Incontinence",
    colissage: 72,
    tva: 20
  },
  {
    code: "MOLI-8G-M",
    designation: "MOLICARE PREMIUM ELASTIC 8G M",
    prixAchat: 0.34,
    prixVente: 0.425,
    unite: "pièce",
    categorie: "Incontinence", 
    colissage: 78,
    tva: 20
  },
  {
    code: "MOLI-6G-XL",
    designation: "MOLICARE PREMIUM ELASTIC 6G XL",
    prixAchat: 0.287,
    prixVente: 0.3583,
    unite: "pièce",
    categorie: "Incontinence",
    colissage: 90,
    tva: 20
  },
  {
    code: "MOLI-6G-L",
    designation: "MOLICARE PREMIUM ELASTIC 6G L",
    prixAchat: 0.36,
    prixVente: 0.45,
    unite: "pièce",
    categorie: "Incontinence",
    colissage: 90,
    tva: 20
  },
  {
    code: "MOLI-6G-M",
    designation: "MOLICARE PREMIUM ELASTIC 6G M",
    prixAchat: 0.287,
    prixVente: 0.3583,
    unite: "pièce",
    categorie: "Incontinence",
    colissage: 90,
    tva: 20
  },
  {
    code: "SENI-7G-2XL",
    designation: "SENI SUPER PLUS CHANGE 7G 2XL",
    prixAchat: 0.693,
    prixVente: 0.8667,
    unite: "pièce",
    categorie: "Incontinence",
    colissage: 30,
    tva: 20
  },
  {
    code: "MOLI-MOB-6G-XL",
    designation: "MOLICARE PREMIUM MOBILE 6G XL",
    prixAchat: 0.633,
    prixVente: 0.7917,
    unite: "pièce",
    categorie: "Incontinence",
    colissage: 56,
    tva: 20
  },
  {
    code: "MOLI-BED-8G",
    designation: "MOLICARE PREMIUM BEDMAT 8G 60X90",
    prixAchat: 0.193,
    prixVente: 0.2417,
    unite: "pièce",
    categorie: "Hygiène",
    colissage: 120,
    tva: 20
  },

  // Produits d'hygiène
  {
    code: "VALA-GANTS",
    designation: "VALACLEAN GANTS TOILETTE COLLECTIVITÉ",
    prixAchat: 0.0134,
    prixVente: 0.0167,
    unite: "pièce",
    categorie: "Hygiène",
    colissage: 1200,
    tva: 20
  },
  {
    code: "BAVOIR-ADULTE",
    designation: "BAVOIR ADULTE 2 PLIS 65X38",
    prixAchat: 0.06,
    prixVente: 0.075,
    unite: "pièce",
    categorie: "Hygiène",
    colissage: 600,
    tva: 20
  },
  {
    code: "GANTS-NIT-M-89",
    designation: "GANTS EXAM NITRILE N/POUDRE 8/9 M",
    prixAchat: 2.40,
    prixVente: 3.00,
    unite: "boîte 100",
    categorie: "Hygiène",
    colissage: 20,
    tva: 20
  },
  {
    code: "GANTS-NIT-M-78",
    designation: "GANTS EXAM NITRILE N/POUDRE 7/8 M",
    prixAchat: 2.40,
    prixVente: 3.00,
    unite: "boîte 100",
    categorie: "Hygiène",
    colissage: 20,
    tva: 20
  },

  // Produits complémentaires
  {
    code: "DESINF-MAINS",
    designation: "SOLUTION HYDROALCOOLIQUE 500ML",
    prixAchat: 1.20,
    prixVente: 1.50,
    unite: "flacon",
    categorie: "Hygiène",
    colissage: 24,
    tva: 20
  },
  {
    code: "LINGETTES-DESINF",
    designation: "LINGETTES DÉSINFECTANTES X100",
    prixAchat: 2.80,
    prixVente: 3.50,
    unite: "boîte",
    categorie: "Hygiène", 
    colissage: 12,
    tva: 20
  },
  {
    code: "SAVON-LIQUIDE",
    designation: "SAVON LIQUIDE ANTIBACTÉRIEN 1L",
    prixAchat: 3.20,
    prixVente: 4.00,
    unite: "flacon",
    categorie: "Hygiène",
    colissage: 12,
    tva: 20
  },
  {
    code: "COMPRESSES-STERILES",
    designation: "COMPRESSES STÉRILES 7.5X7.5 X50",
    prixAchat: 1.60,
    prixVente: 2.00,
    unite: "boîte",
    categorie: "Soins",
    colissage: 50,
    tva: 20
  },
  {
    code: "SPARADRAP-5M",
    designation: "SPARADRAP MÉDICAL 2.5CM X 5M",
    prixAchat: 0.80,
    prixVente: 1.00,
    unite: "rouleau",
    categorie: "Soins",
    colissage: 24,
    tva: 20
  },
  {
    code: "THERMOMETRE-DIGIT",
    designation: "THERMOMÈTRE DIGITAL MÉDICAL",
    prixAchat: 4.80,
    prixVente: 6.00,
    unite: "pièce",
    categorie: "Matériel médical",
    colissage: 1,
    tva: 20
  }
];

// Catégories disponibles
export const PRODUCT_CATEGORIES = [
  "Incontinence",
  "Hygiène", 
  "Soins",
  "Matériel médical"
] as const;