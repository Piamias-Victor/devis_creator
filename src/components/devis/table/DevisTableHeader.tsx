"use client";

import { cn } from "@/lib/utils/cn";

/**
 * Header du tableau devis avec glassmorphism
 * Colonnes optimisées desktop professionnel
 */
export function DevisTableHeader() {
  const columns = [
    { key: "code", label: "Code", width: "w-24" },
    { key: "designation", label: "Désignation", width: "flex-1" },
    { key: "quantite", label: "Qté", width: "w-20" },
    { key: "colis", label: "Colis", width: "w-20" },
    { key: "prixAchat", label: "Prix Achat HT", width: "w-32" },
    { key: "remise", label: "Remise", width: "w-24" },
    { key: "prixVente", label: "Prix Vente HT", width: "w-32" },
    { key: "marge", label: "Marge", width: "w-24" },
    { key: "total", label: "Total HT", width: "w-32" },
    { key: "actions", label: "Actions", width: "w-24" },
  ];

  return (
    <thead className={cn(
      "bg-gray-100/10 backdrop-blur-sm border-b border-gray-100/10",
      "supports-[backdrop-filter]:bg-gray-100/10"
    )}>
      <tr>
        {columns.map((column) => (
          <th
            key={column.key}
            className={cn(
              "px-4 py-4 text-left text-sm font-semibold",
              "text-gray-700 dark:text-gray-300",
              column.width
            )}
          >
            {column.label}
          </th>
        ))}
      </tr>
    </thead>
  );
}