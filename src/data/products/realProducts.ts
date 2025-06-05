import { Product } from "@/types";

/**
 * Base de données produits réelle EHPAD/Pharmacie COMPLÈTE
 * 86 produits Molicare + 12 produits Seni = 98 produits total
 * Convertie depuis Excel avec prix réels
 */
export const REAL_PRODUCTS: Product[] = [
  // Incontinence - Slips de fixation - Molicare Premium FIXPANTS - Btes de 3
  {
    code: "4052199274621",
    designation: "MoliCare Premium Fixpants Long Leg B3 - S",
    prixAchat: 0.86,
    prixVente: 0.946,
    unite: "pièce",
    categorie: "Incontinence - Slips de fixation",
    colissage: 20,
    tva: 20
  },
  {
    code: "4052199274652",
    designation: "MoliCare Premium Fixpants Long Leg B3 - M",
    prixAchat: 0.86,
    prixVente: 0.946,
    unite: "pièce",
    categorie: "Incontinence - Slips de fixation",
    colissage: 20,
    tva: 20
  },
  {
    code: "4052199274683",
    designation: "MoliCare Premium Fixpants Long Leg B3 - L",
    prixAchat: 0.86,
    prixVente: 0.946,
    unite: "pièce",
    categorie: "Incontinence - Slips de fixation",
    colissage: 20,
    tva: 20
  },
  {
    code: "4052199274713",
    designation: "MoliCare Premium Fixpants Long Leg B3 - XL",
    prixAchat: 0.86,
    prixVente: 0.946,
    unite: "pièce",
    categorie: "Incontinence - Slips de fixation",
    colissage: 20,
    tva: 20
  },
  {
    code: "4052199274744",
    designation: "MoliCare Premium Fixpants Long Leg B3 - XXL",
    prixAchat: 0.86,
    prixVente: 0.946,
    unite: "pièce",
    categorie: "Incontinence - Slips de fixation",
    colissage: 20,
    tva: 20
  },
  
  // Incontinence - Slips de fixation - Molicare Premium FIXPANTS - Btes de 25
  {
    code: "4052199267692",
    designation: "MoliCare Premium FIXPANTS S longleg - Bte de 25",
    prixAchat: 0.36,
    prixVente: 0.396,
    unite: "pièce",
    categorie: "Incontinence - Slips de fixation",
    colissage: 8,
    tva: 20
  },
  {
    code: "4052199267722",
    designation: "MoliCare Premium FIXPANTS M longleg - Bte de 25",
    prixAchat: 0.37,
    prixVente: 0.407,
    unite: "pièce",
    categorie: "Incontinence - Slips de fixation",
    colissage: 8,
    tva: 20
  },
  {
    code: "4052199267753",
    designation: "MoliCare Premium FIXPANTS L longleg - Bte de 25",
    prixAchat: 0.38,
    prixVente: 0.418,
    unite: "pièce",
    categorie: "Incontinence - Slips de fixation",
    colissage: 8,
    tva: 20
  },
  {
    code: "4052199267784",
    designation: "MoliCare Premium FIXPANTS XL longleg - Bte de 25",
    prixAchat: 0.42,
    prixVente: 0.462,
    unite: "pièce",
    categorie: "Incontinence - Slips de fixation",
    colissage: 8,
    tva: 20
  },
  {
    code: "4052199267814",
    designation: "MoliCare Premium FIXPANTS XXL longleg - Bte de 25",
    prixAchat: 0.45,
    prixVente: 0.495,
    unite: "pièce",
    categorie: "Incontinence - Slips de fixation",
    colissage: 8,
    tva: 20
  },
  {
    code: "4052199265933",
    designation: "MoliCare Premium FIXPANTS XXXL longleg - Bte de 25",
    prixAchat: 0.46,
    prixVente: 0.506,
    unite: "pièce",
    categorie: "Incontinence - Slips de fixation",
    colissage: 8,
    tva: 20
  },

  // Incontinence - Protections anatomiques - Molicare Premium Lady Pad
  {
    code: "4052199289557",
    designation: "Molicare Premium LADY pad 0,5G",
    prixAchat: 0.06,
    prixVente: 0.066,
    unite: "pièce",
    categorie: "Incontinence - Protections anatomiques",
    colissage: 8,
    tva: 20
  },
  {
    code: "4052199293325",
    designation: "Molicare Premium LADY pad 2G",
    prixAchat: 0.16,
    prixVente: 0.176,
    unite: "pièce",
    categorie: "Incontinence - Protections anatomiques",
    colissage: 18,
    tva: 20
  },
  {
    code: "4052199290553",
    designation: "Molicare Premium LADY pad 3G",
    prixAchat: 0.17,
    prixVente: 0.187,
    unite: "pièce",
    categorie: "Incontinence - Protections anatomiques",
    colissage: 12,
    tva: 20
  },
  {
    code: "4052199290645",
    designation: "Molicare Premium LADY pad 4,5G",
    prixAchat: 0.22,
    prixVente: 0.242,
    unite: "pièce",
    categorie: "Incontinence - Protections anatomiques",
    colissage: 12,
    tva: 20
  },
  {
    code: "4052199291031",
    designation: "Molicare Premium LADY pad 5G",
    prixAchat: 0.24,
    prixVente: 0.264,
    unite: "pièce",
    categorie: "Incontinence - Protections anatomiques",
    colissage: 12,
    tva: 20
  },

  // Incontinence - Protections anatomiques - Molicare Premium Lady Pants
  {
    code: "4052199275840",
    designation: "Molicare Premium Lady Pants 5G M",
    prixAchat: 0.62,
    prixVente: 0.682,
    unite: "pièce",
    categorie: "Incontinence - Protections anatomiques",
    colissage: 8,
    tva: 20
  },
  {
    code: "4052199275871",
    designation: "Molicare Premium Lady Pants 5G L",
    prixAchat: 0.62,
    prixVente: 0.682,
    unite: "pièce",
    categorie: "Incontinence - Protections anatomiques",
    colissage: 8,
    tva: 20
  },
  {
    code: "4052199275932",
    designation: "Molicare Premium Lady Pants 7G M",
    prixAchat: 0.73,
    prixVente: 0.803,
    unite: "pièce",
    categorie: "Incontinence - Protections anatomiques",
    colissage: 4,
    tva: 20
  },
  {
    code: "4052199276830",
    designation: "Molicare Premium Lady Pants 7G L",
    prixAchat: 0.82,
    prixVente: 0.902,
    unite: "pièce",
    categorie: "Incontinence - Protections anatomiques",
    colissage: 4,
    tva: 20
  },

  // Incontinence - Protections anatomiques - Molicare Premium Men Pad
  {
    code: "4052199664743",
    designation: "Molicare Premium Men Pad 2G",
    prixAchat: 0.23,
    prixVente: 0.253,
    unite: "pièce",
    categorie: "Incontinence - Protections anatomiques",
    colissage: 12,
    tva: 20
  },
  {
    code: "4052199666433",
    designation: "Molicare Premium Men Pad 3G",
    prixAchat: 0.20,
    prixVente: 0.220,
    unite: "pièce",
    categorie: "Incontinence - Protections anatomiques",
    colissage: 12,
    tva: 20
  },
  {
    code: "4052199664781",
    designation: "Molicare Premium Men Pad 4G",
    prixAchat: 0.21,
    prixVente: 0.231,
    unite: "pièce",
    categorie: "Incontinence - Protections anatomiques",
    colissage: 12,
    tva: 20
  },
  {
    code: "4052199664828",
    designation: "Molicare Premium Men Pad 5G",
    prixAchat: 0.26,
    prixVente: 0.286,
    unite: "pièce",
    categorie: "Incontinence - Protections anatomiques",
    colissage: 12,
    tva: 20
  },

  // Incontinence - Protections anatomiques - Molicare Premium Men Pants
  {
    code: "4052199275727",
    designation: "Molicare Premium MEN pants 5G M",
    prixAchat: 0.53,
    prixVente: 0.583,
    unite: "pièce",
    categorie: "Incontinence - Protections anatomiques",
    colissage: 4,
    tva: 20
  },
  {
    code: "4052199275758",
    designation: "Molicare Premium MEN pants 5G L",
    prixAchat: 0.53,
    prixVente: 0.583,
    unite: "pièce",
    categorie: "Incontinence - Protections anatomiques",
    colissage: 4,
    tva: 20
  },
  {
    code: "4052199275789",
    designation: "Molicare Premium MEN pants 7G M",
    prixAchat: 0.72,
    prixVente: 0.792,
    unite: "pièce",
    categorie: "Incontinence - Protections anatomiques",
    colissage: 4,
    tva: 20
  },
  {
    code: "4052199275819",
    designation: "Molicare Premium MEN pants 7G L",
    prixAchat: 0.73,
    prixVente: 0.803,
    unite: "pièce",
    categorie: "Incontinence - Protections anatomiques",
    colissage: 4,
    tva: 20
  },

  // Incontinence - Protections anatomiques - Molicare Premium Form
  {
    code: "4052199582351",
    designation: "MoliCare Pr. Form 6G",
    prixAchat: 0.29,
    prixVente: 0.319,
    unite: "pièce",
    categorie: "Incontinence - Protections anatomiques",
    colissage: 4,
    tva: 20
  },
  {
    code: "4052199582382",
    designation: "MoliCare Pr. Form 8G",
    prixAchat: 0.37,
    prixVente: 0.407,
    unite: "pièce",
    categorie: "Incontinence - Protections anatomiques",
    colissage: 4,
    tva: 20
  },
  {
    code: "4052199582399",
    designation: "MoliCare Pr. Form 9G",
    prixAchat: 0.50,
    prixVente: 0.550,
    unite: "pièce",
    categorie: "Incontinence - Protections anatomiques",
    colissage: 4,
    tva: 20
  },

  // Incontinence - Sous-vêtements absorbants personnes mobiles - Molicare Premium Mobile
  {
    code: "4052199275246",
    designation: "Molicare Premium MOBILE 5G S",
    prixAchat: 0.47,
    prixVente: 0.517,
    unite: "pièce",
    categorie: "Incontinence - Sous-vêtements absorbants",
    colissage: 4,
    tva: 20
  },
  {
    code: "4052199275277",
    designation: "Molicare Premium MOBILE 5G M",
    prixAchat: 0.47,
    prixVente: 0.517,
    unite: "pièce",
    categorie: "Incontinence - Sous-vêtements absorbants",
    colissage: 3,
    tva: 20
  },
  {
    code: "4052199275307",
    designation: "Molicare Premium MOBILE 5G L",
    prixAchat: 0.53,
    prixVente: 0.583,
    unite: "pièce",
    categorie: "Incontinence - Sous-vêtements absorbants",
    colissage: 4,
    tva: 20
  },
  {
    code: "4052199275338",
    designation: "Molicare Premium MOBILE 5G XL",
    prixAchat: 0.68,
    prixVente: 0.748,
    unite: "pièce",
    categorie: "Incontinence - Sous-vêtements absorbants",
    colissage: 4,
    tva: 20
  },
  {
    code: "4052199275369",
    designation: "Molicare Premium MOBILE 6G XS",
    prixAchat: 0.65,
    prixVente: 0.715,
    unite: "pièce",
    categorie: "Incontinence - Sous-vêtements absorbants",
    colissage: 4,
    tva: 20
  },
  {
    code: "4052199275390",
    designation: "Molicare Premium MOBILE 6G S",
    prixAchat: 0.61,
    prixVente: 0.671,
    unite: "pièce",
    categorie: "Incontinence - Sous-vêtements absorbants",
    colissage: 4,
    tva: 20
  },
  {
    code: "4052199275420",
    designation: "Molicare Premium MOBILE 6G M",
    prixAchat: 0.64,
    prixVente: 0.704,
    unite: "pièce",
    categorie: "Incontinence - Sous-vêtements absorbants",
    colissage: 3,
    tva: 20
  },
  {
    code: "4052199275451",
    designation: "Molicare Premium MOBILE 6G L",
    prixAchat: 0.70,
    prixVente: 0.770,
    unite: "pièce",
    categorie: "Incontinence - Sous-vêtements absorbants",
    colissage: 4,
    tva: 20
  },
  {
    code: "4052199275482",
    designation: "Molicare Premium MOBILE 6G XL",
    prixAchat: 0.80,
    prixVente: 0.880,
    unite: "pièce",
    categorie: "Incontinence - Sous-vêtements absorbants",
    colissage: 4,
    tva: 20
  },
  {
    code: "4052199275512",
    designation: "Molicare Premium MOBILE 8G S",
    prixAchat: 0.71,
    prixVente: 0.781,
    unite: "pièce",
    categorie: "Incontinence - Sous-vêtements absorbants",
    colissage: 4,
    tva: 20
  },
  {
    code: "4052199275543",
    designation: "Molicare Premium MOBILE 8G M",
    prixAchat: 0.74,
    prixVente: 0.814,
    unite: "pièce",
    categorie: "Incontinence - Sous-vêtements absorbants",
    colissage: 3,
    tva: 20
  },
  {
    code: "4052199275574",
    designation: "Molicare Premium MOBILE 8G L",
    prixAchat: 0.80,
    prixVente: 0.880,
    unite: "pièce",
    categorie: "Incontinence - Sous-vêtements absorbants",
    colissage: 4,
    tva: 20
  },
  {
    code: "4052199275604",
    designation: "Molicare Premium MOBILE 8G XL",
    prixAchat: 0.91,
    prixVente: 1.001,
    unite: "pièce",
    categorie: "Incontinence - Sous-vêtements absorbants",
    colissage: 4,
    tva: 20
  },
  {
    code: "4052199275635",
    designation: "Molicare Premium MOBILE 10G M",
    prixAchat: 0.85,
    prixVente: 0.935,
    unite: "pièce",
    categorie: "Incontinence - Sous-vêtements absorbants",
    colissage: 3,
    tva: 20
  },
  {
    code: "4052199275666",
    designation: "Molicare Premium MOBILE 10G L",
    prixAchat: 0.92,
    prixVente: 1.012,
    unite: "pièce",
    categorie: "Incontinence - Sous-vêtements absorbants",
    colissage: 4,
    tva: 20
  },
  {
    code: "4052199275697",
    designation: "Molicare Premium MOBILE 10G XL",
    prixAchat: 1.05,
    prixVente: 1.155,
    unite: "pièce",
    categorie: "Incontinence - Sous-vêtements absorbants",
    colissage: 4,
    tva: 20
  },

  // Incontinence - Changes complets - Molicare Premium Elastic
  {
    code: "4052199296975",
    designation: "Molicare Premium Elastic 6 Gouttes S",
    prixAchat: 0.30,
    prixVente: 0.330,
    unite: "pièce",
    categorie: "Incontinence - Changes complets",
    colissage: 3,
    tva: 20
  },
  {
    code: "4052199297002",
    designation: "Molicare Premium Elastic 6 Gouttes M",
    prixAchat: 0.31,
    prixVente: 0.341,
    unite: "pièce",
    categorie: "Incontinence - Changes complets",
    colissage: 3,
    tva: 20
  },
  {
    code: "4052199297033",
    designation: "Molicare Premium Elastic 6 Gouttes L",
    prixAchat: 0.41,
    prixVente: 0.451,
    unite: "pièce",
    categorie: "Incontinence - Changes complets",
    colissage: 3,
    tva: 20
  },
  {
    code: "4052199299433",
    designation: "Molicare Premium Elastic 6 Gouttes XL",
    prixAchat: 0.55,
    prixVente: 0.605,
    unite: "pièce",
    categorie: "Incontinence - Changes complets",
    colissage: 4,
    tva: 20
  },
  {
    code: "4052199297217",
    designation: "Molicare Premium Elastic 8 Gouttes S",
    prixAchat: 0.37,
    prixVente: 0.407,
    unite: "pièce",
    categorie: "Incontinence - Changes complets",
    colissage: 3,
    tva: 20
  },
  {
    code: "4052199297248",
    designation: "Molicare Premium Elastic 8G M",
    prixAchat: 0.38,
    prixVente: 0.418,
    unite: "pièce",
    categorie: "Incontinence - Changes complets",
    colissage: 3,
    tva: 20
  },
  {
    code: "4052199297361",
    designation: "Molicare Premium Elastic 8 Gouttes L",
    prixAchat: 0.46,
    prixVente: 0.506,
    unite: "pièce",
    categorie: "Incontinence - Changes complets",
    colissage: 3,
    tva: 20
  },
  {
    code: "4052199299532",
    designation: "Molicare Premium Elastic 8 Gouttes XL",
    prixAchat: 0.64,
    prixVente: 0.704,
    unite: "pièce",
    categorie: "Incontinence - Changes complets",
    colissage: 4,
    tva: 20
  },
  {
    code: "4052199297279",
    designation: "Molicare Premium Elastic 9 Gouttes S",
    prixAchat: 0.46,
    prixVente: 0.506,
    unite: "pièce",
    categorie: "Incontinence - Changes complets",
    colissage: 3,
    tva: 20
  },
  {
    code: "4052199297309",
    designation: "Molicare Premium Elastic 9G M",
    prixAchat: 0.47,
    prixVente: 0.517,
    unite: "pièce",
    categorie: "Incontinence - Changes complets",
    colissage: 3,
    tva: 20
  },
  {
    code: "4052199297392",
    designation: "Molicare Premium Elastic 9 Gouttes L",
    prixAchat: 0.56,
    prixVente: 0.616,
    unite: "pièce",
    categorie: "Incontinence - Changes complets",
    colissage: 3,
    tva: 20
  },
  {
    code: "4052199299587",
    designation: "Molicare Premium Elastic 9 Gouttes XL",
    prixAchat: 0.67,
    prixVente: 0.737,
    unite: "pièce",
    categorie: "Incontinence - Changes complets",
    colissage: 4,
    tva: 20
  },
  {
    code: "4052199303468",
    designation: "Molicare Premium Elastic 10G S",
    prixAchat: 0.50,
    prixVente: 0.550,
    unite: "pièce",
    categorie: "Incontinence - Changes complets",
    colissage: 3,
    tva: 20
  },
  {
    code: "4052199303413",
    designation: "Molicare Premium Elastic 10G M",
    prixAchat: 0.52,
    prixVente: 0.572,
    unite: "pièce",
    categorie: "Incontinence - Changes complets",
    colissage: 4,
    tva: 20
  },
  {
    code: "4052199301679",
    designation: "Molicare Premium Elastic 10G L",
    prixAchat: 0.60,
    prixVente: 0.660,
    unite: "pièce",
    categorie: "Incontinence - Changes complets",
    colissage: 4,
    tva: 20
  },
  {
    code: "4052199301723",
    designation: "Molicare Premium Elastic 10D XL P14",
    prixAchat: 0.66,
    prixVente: 0.726,
    unite: "pièce",
    categorie: "Incontinence - Changes complets",
    colissage: 4,
    tva: 20
  },
  {
    code: "4052199502717",
    designation: "Molicare Rectangular 5d 15x60 P28",
    prixAchat: 0.16,
    prixVente: 0.176,
    unite: "pièce",
    categorie: "Incontinence - Changes complets",
    colissage: 4,
    tva: 20
  },

  // Alèses - Molicare Premium BED MAT
  {
    code: "4052199505435",
    designation: "Molicare Premium Bed Mat 5 gouttes 60X60 cm",
    prixAchat: 0.12,
    prixVente: 0.132,
    unite: "pièce",
    categorie: "Alèses",
    colissage: 3,
    tva: 20
  },
  {
    code: "4052199505466",
    designation: "Molicare Premium Bed Mat 7 gouttes 40X60 cm",
    prixAchat: 0.09,
    prixVente: 0.099,
    unite: "pièce",
    categorie: "Alèses",
    colissage: 6,
    tva: 20
  },
  {
    code: "4052199505404",
    designation: "Molicare Premium Bed Mat 7 gouttes 60X60 cm",
    prixAchat: 0.13,
    prixVente: 0.143,
    unite: "pièce",
    categorie: "Alèses",
    colissage: 3,
    tva: 20
  },
  {
    code: "4052199505374",
    designation: "Molicare Premium Bed Mat 7 gouttes 60X90 cm",
    prixAchat: 0.20,
    prixVente: 0.220,
    unite: "pièce",
    categorie: "Alèses",
    colissage: 4,
    tva: 20
  },
  {
    code: "4052199507811",
    designation: "Molicare Premium Bed Mat 7 gouttes 60X90 cm bordable",
    prixAchat: 0.40,
    prixVente: 0.440,
    unite: "pièce",
    categorie: "Alèses",
    colissage: 4,
    tva: 20
  },
  {
    code: "4052199508580",
    designation: "Molicare Premium Bed Mat 8 gouttes 40X60 cm",
    prixAchat: 0.10,
    prixVente: 0.110,
    unite: "pièce",
    categorie: "Alèses",
    colissage: 6,
    tva: 20
  },
  {
    code: "4052199515281",
    designation: "Molicare Premium Bed Mat 8 gouttes 60X60 cm",
    prixAchat: 0.14,
    prixVente: 0.154,
    unite: "pièce",
    categorie: "Alèses",
    colissage: 4,
    tva: 20
  },
  {
    code: "4052199508603",
    designation: "Molicare Premium Bed Mat 8 gouttes 60X90 cm",
    prixAchat: 0.22,
    prixVente: 0.242,
    unite: "pièce",
    categorie: "Alèses",
    colissage: 4,
    tva: 20
  },
  {
    code: "4052199505343",
    designation: "Molicare Premium Bed Mat 9 gouttes 60X90 cm",
    prixAchat: 0.34,
    prixVente: 0.374,
    unite: "pièce",
    categorie: "Alèses",
    colissage: 2,
    tva: 20
  },

  // Incontinence - Protections anatomiques - Molicare Pads
  {
    code: "4052199663944",
    designation: "Molicare Pad 2G",
    prixAchat: 0.11,
    prixVente: 0.121,
    unite: "pièce",
    categorie: "Incontinence - Protections anatomiques",
    colissage: 12,
    tva: 20
  },
  {
    code: "4052199663982",
    designation: "Molicare Pad 3G",
    prixAchat: 0.13,
    prixVente: 0.143,
    unite: "pièce",
    categorie: "Incontinence - Protections anatomiques",
    colissage: 6,
    tva: 20
  },
  {
    code: "4052199664026",
    designation: "Molicare Pad 4G",
    prixAchat: 0.17,
    prixVente: 0.187,
    unite: "pièce",
    categorie: "Incontinence - Protections anatomiques",
    colissage: 9,
    tva: 20
  },

  // =====================================================================
  // NOUVEAUX PRODUITS SENI - INTÉGRATION COMPLÈTE
  // =====================================================================

  // Seni Active Classic - Sous-vêtements absorbants équivalents Molicare Mobile
  {
    code: "SE-096-SM30-AC1",
    designation: "Seni Active Classic Small - 30 pièces",
    prixAchat: 0.53,
    prixVente: 0.532,
    unite: "pièce",
    categorie: "Incontinence - Sous-vêtements absorbants",
    colissage: 4,
    tva: 20
  },
  {
    code: "SE-096-ME30-AC1",
    designation: "Seni Active Classic Medium - 30 pièces",
    prixAchat: 0.50,
    prixVente: 0.504,
    unite: "pièce",
    categorie: "Incontinence - Sous-vêtements absorbants",
    colissage: 4,
    tva: 20
  },
  {
    code: "SE-096-LA30-AC1",
    designation: "Seni Active Classic Large - 30 pièces",
    prixAchat: 0.55,
    prixVente: 0.552,
    unite: "pièce",
    categorie: "Incontinence - Sous-vêtements absorbants",
    colissage: 4,
    tva: 20
  },
  {
    code: "SE-096-XL30-AC1",
    designation: "Seni Active Classic Extra Large - 30 pièces",
    prixAchat: 0.65,
    prixVente: 0.647,
    unite: "pièce",
    categorie: "Incontinence - Sous-vêtements absorbants",
    colissage: 4,
    tva: 20
  },

  // Seni Classic Basic - Changes complets équivalents Molicare Elastic
  {
    code: "SE-094-SM30-CB1",
    designation: "Seni Classic Basic Small - 30 pièces",
    prixAchat: 0.32,
    prixVente: 0.318,
    unite: "pièce",
    categorie: "Incontinence - Changes complets",
    colissage: 3,
    tva: 20
  },
  {
    code: "SE-094-ME30-CB1",
    designation: "Seni Classic Basic Medium - 30 pièces",
    prixAchat: 0.39,
    prixVente: 0.386,
    unite: "pièce",
    categorie: "Incontinence - Changes complets",
    colissage: 3,
    tva: 20
  },
  {
    code: "SE-094-LA30-CB1",
    designation: "Seni Classic Basic Large - 30 pièces",
    prixAchat: 0.45,
    prixVente: 0.452,
    unite: "pièce",
    categorie: "Incontinence - Changes complets",
    colissage: 3,
    tva: 20
  },
  {
    code: "SE-094-XL30-CB1",
    designation: "Seni Classic Basic Extra Large - 30 pièces",
    prixAchat: 0.48,
    prixVente: 0.478,
    unite: "pièce",
    categorie: "Incontinence - Changes complets",
    colissage: 3,
    tva: 20
  },

  // Seni Classic Plus - Changes complets renforcés
  {
    code: "SE-094-SM30-SC2",
    designation: "Seni Classic Plus Small - 30 pièces",
    prixAchat: 0.35,
    prixVente: 0.349,
    unite: "pièce",
    categorie: "Incontinence - Changes complets",
    colissage: 3,
    tva: 20
  },
  {
    code: "SE-094-ME30-CP2",
    designation: "Seni Classic Plus Medium - 30 pièces",
    prixAchat: 0.42,
    prixVente: 0.423,
    unite: "pièce",
    categorie: "Incontinence - Changes complets",
    colissage: 3,
    tva: 20
  },
  {
    code: "SE-094-LA30-SC2",
    designation: "Seni Classic Plus Large - 30 pièces",
    prixAchat: 0.50,
    prixVente: 0.500,
    unite: "pièce",
    categorie: "Incontinence - Changes complets",
    colissage: 3,
    tva: 20
  },
  {
    code: "SE-094-XL30-SC2",
    designation: "Seni Classic Plus Extra Large - 30 pièces",
    prixAchat: 0.53,
    prixVente: 0.528,
    unite: "pièce",
    categorie: "Incontinence - Changes complets",
    colissage: 3,
    tva: 20
  },

  // Seni Super Plus XXL - Format spécial grande taille
  {
    code: "SE-094-2X10-G02",
    designation: "Seni Super Plus XXL - 10 pièces",
    prixAchat: 0.78,
    prixVente: 0.778,
    unite: "pièce",
    categorie: "Incontinence - Changes complets",
    colissage: 2,
    tva: 20
  },

  // Seni Soft Basic - Alèses équivalent Molicare Bed Mat
  {
    code: "SE-091-SB25-D03",
    designation: "Seni Soft Basic 90x60 cm - 25 pièces",
    prixAchat: 0.27,
    prixVente: 0.269,
    unite: "pièce",
    categorie: "Alèses",
    colissage: 4,
    tva: 20
  }
];

// Export des catégories réelles MISES À JOUR
export const REAL_PRODUCT_CATEGORIES = [
  "Incontinence - Slips de fixation",
  "Incontinence - Protections anatomiques", 
  "Incontinence - Sous-vêtements absorbants",
  "Incontinence - Changes complets",
  "Alèses"
] as const;