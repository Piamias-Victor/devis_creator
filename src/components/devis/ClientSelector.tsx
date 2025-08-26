"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils/cn";
import { Client } from "@/types";
import { useClients } from "@/lib/hooks/useClients";
import { ChevronDown, Search, Plus, User, Building } from "lucide-react";

interface ClientSelectorProps {
  selectedClient: Client | null;
  onSelectClient: (client: Client) => void;
  onCreateClient?: () => void;
  className?: string;
}

/**
 * Sélecteur de client avec PORTAL
 * SOLUTION DÉFINITIVE - Le dropdown est rendu au niveau body
 */
export function ClientSelector({ 
  selectedClient, 
  onSelectClient, 
  onCreateClient,
  className 
}: ClientSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { clients, loading } = useClients();

  // Calculer position du dropdown
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8, // 8px de marge
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  }, [isOpen]);

  // Fermer dropdown au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current && 
        !buttonRef.current.contains(event.target as Node) &&
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fermer avec Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  // Filtrer clients selon recherche
  const filteredClients = clients.filter(client =>
    client.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
  (client.siret && client.siret.toLowerCase().includes(searchQuery.toLowerCase())) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectClient = (client: Client) => {
    onSelectClient(client);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  // Composant Dropdown pour le portal
  const DropdownContent = () => (
    <div
      ref={dropdownRef}
      style={{
        position: "absolute",
        top: dropdownPosition.top,
        left: dropdownPosition.left,
        width: dropdownPosition.width,
        zIndex: 999999, // Z-INDEX MAXIMUM
      }}
      className={cn(
        "bg-white backdrop-blur-xl border border-gray-200 rounded-xl",
        "shadow-2xl shadow-black/50 max-h-96 overflow-hidden",
        "animate-in fade-in-0 zoom-in-95 duration-200"
      )}
    >
      {/* Barre de recherche */}
      <div className="p-4 border-b border-gray-100 bg-white">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-gray-500" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un client..."
            className={cn(
              "w-full pl-10 pr-4 py-2 rounded-lg",
              "bg-gray-50 border border-gray-200",
              "text-gray-900 placeholder-gray-500",
              "focus:outline-none focus:ring-2 focus:ring-blue-500"
            )}
            autoFocus
          />
        </div>
      </div>

      {/* Liste des clients */}
      <div className="max-h-64 overflow-y-auto bg-white">
        {loading ? (
          <div className="p-4 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Chargement...</p>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-gray-600 mb-3">
              {searchQuery ? "Aucun client trouvé" : "Aucun client disponible"}
            </p>
            {onCreateClient && (
              <button
                onClick={() => {
                  onCreateClient();
                  setIsOpen(false);
                }}
                className={cn(
                  "flex items-center space-x-2 mx-auto px-4 py-2 rounded-lg",
                  "bg-blue-600 hover:bg-blue-700 text-white",
                  "transition-colors duration-200 text-sm"
                )}
              >
                <Plus className="w-4 h-4" />
                <span>Créer un client</span>
              </button>
            )}
          </div>
        ) : (
          <div className="p-2">
            {filteredClients.map((client) => (
              <button
                key={client.id}
                onClick={() => handleSelectClient(client)}
                className={cn(
                  "w-full flex items-center space-x-3 p-3 rounded-lg",
                  "hover:bg-blue-50 transition-colors duration-200 text-left",
                  selectedClient?.id === client.id && "bg-blue-100"
                )}
              >
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Building className="w-4 h-4 text-blue-600" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {client.nom}
                  </div>
                  <div className="text-sm text-gray-600 truncate">
                    {client.email} • {client.siret || "SIRET non renseigné"}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer avec action rapide */}
      {onCreateClient && filteredClients.length > 0 && (
        <div className="p-3 border-t border-gray-100 bg-white">
          <button
            onClick={() => {
              onCreateClient();
              setIsOpen(false);
            }}
            className={cn(
              "w-full flex items-center justify-center space-x-2 p-2 rounded-lg",
              "bg-gray-100 hover:bg-gray-200 text-gray-700",
              "transition-colors duration-200 text-sm"
            )}
          >
            <Plus className="w-4 h-4" />
            <span>Créer un nouveau client</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className={cn("relative w-full", className)}>
      {/* Bouton principal */}
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className={cn(
          "w-full flex items-center justify-between p-4 rounded-lg",
          "bg-white/10 backdrop-blur-md border border-gray-200",
          "hover:bg-white/15 transition-all duration-200",
          "supports-[backdrop-filter]:bg-white/10",
          selectedClient ? "text-gray-900 dark:text-gray-100" : "text-gray-500"
        )}
      >
        <div className="flex items-center space-x-3">
          <div className={cn(
            "p-2 rounded-lg",
            selectedClient 
              ? "bg-blue-500/20 text-blue-600" 
              : "bg-gray-500/20 text-gray-500"
          )}>
            {selectedClient ? <Building className="w-5 h-5" /> : <User className="w-5 h-5" />}
          </div>
          
          <div className="text-left">
            {selectedClient ? (
              <>
                <div className="font-medium">{selectedClient.nom}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedClient.siret}
                </div>
              </>
            ) : (
              <div className="font-medium">Sélectionner un client</div>
            )}
          </div>
        </div>
        
        <ChevronDown className={cn(
          "w-5 h-5 transition-transform duration-200",
          isOpen && "rotate-180"
        )} />
      </button>

      {/* Overlay de fond */}
      {isOpen && createPortal(
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" style={{ zIndex: 999998 }} />,
        document.body
      )}

      {/* Dropdown rendu dans un portal au niveau body */}
      {isOpen && typeof window !== "undefined" && createPortal(
        <DropdownContent />,
        document.body
      )}
    </div>
  );
}