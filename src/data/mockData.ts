import { Client, DashboardStats } from "@/types";

/**
 * Données de test basées sur le devis fourni
 */
export const MOCK_CLIENTS: Client[] = [
  {
    id: "CLI001",
    nom: "EHPAD SERENU 1 PORETTE",
    adresse: "QUARTIER PORETTE, 20250 CORTE",
    telephone: "0495461213",
    email: "contact@ehpad-serenu.fr",
    siret: "12345678901234",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "CLI002", 
    nom: "PHARMACIE DU ROND POINT CORTE",
    adresse: "24 AVENUE DU 9 SEPTEMBRE, 20250 CORTE",
    telephone: "04 95 46 08 95",
    email: "contact@pharmaciedurondpointcorte.com",
    siret: "98187961200019",
    createdAt: new Date("2024-02-10"),
  },
  {
    id: "CLI003",
    nom: "EHPAD LES JARDINS DE CORSE",
    adresse: "15 RUE DE LA PAIX, 20000 AJACCIO", 
    telephone: "04 95 12 34 56",
    email: "direction@jardins-corse.fr",
    siret: "45678912300056",
    createdAt: new Date("2024-03-20"),
  }
];

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  totalDevis: 47,
  chiffreAffaires: 156780.50,
  margeGlobale: 18.5,
  clientsActifs: 12
};