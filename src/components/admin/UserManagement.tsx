"use client";

import { useState, useEffect } from "react";
import { UserPlus, Search, Edit, Trash2, Shield, Mail, Phone, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { CreateUserModal } from "./CreateUserModal";
import { EditUserModal } from "./EditUserModal";
import { User } from "@/types";
import { UsersService } from "@/lib/services/users.service";

/**
 * Composant de gestion des utilisateurs CORRIGÉ
 * Avec vraies fonctionnalités CRUD
 */
export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Charger les utilisateurs depuis l'API
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const usersData = await UsersService.getUsers();
      setUsers(usersData);
      console.log("✅ Utilisateurs chargés:", usersData.length);
    } catch (err) {
      console.error("❌ Erreur chargement utilisateurs:", err);
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir désactiver l'utilisateur "${userName}" ?`)) {
      return;
    }

    try {
      setActionLoading(`delete-${userId}`);
      await UsersService.deleteUser(userId);
      console.log("✅ Utilisateur supprimé:", userId);
      
      // Recharger la liste immédiatement
      await loadUsers();
      
    } catch (err) {
      console.error("❌ Erreur suppression utilisateur:", err);
      alert(err instanceof Error ? err.message : "Erreur lors de la suppression");
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditUser = (user: User) => {
    console.log("✏️ Édition utilisateur:", user.email);
    setEditingUser(user);
  };

  const handleUserCreated = async () => {
    console.log("✅ Utilisateur créé - rechargement");
    setShowCreateModal(false);
    await loadUsers();
  };

  const handleUserUpdated = async () => {
    console.log("✅ Utilisateur modifié - rechargement");
    setEditingUser(null);
    await loadUsers();
  };

  const handleReactivateUser = async (userId: string, userName: string) => {
    if (!confirm(`Réactiver l'utilisateur "${userName}" ?`)) {
      return;
    }

    try {
      setActionLoading(`reactivate-${userId}`);
      await UsersService.reactivateUser(userId);
      console.log("✅ Utilisateur réactivé:", userId);
      await loadUsers();
    } catch (err) {
      console.error("❌ Erreur réactivation:", err);
      alert(err instanceof Error ? err.message : "Erreur lors de la réactivation");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter(user => 
    user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.prenom && user.prenom.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getRoleColor = (role: User['role']) => {
    switch (role) {
      case 'admin':
        return "bg-red-500/20 text-red-700 border-red-500/30";
      case 'pharmacien':
        return "bg-blue-500/20 text-blue-700 border-blue-500/30";
      case 'assistant':
        return "bg-green-500/20 text-green-700 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-700 border-gray-500/30";
    }
  };

  const getRoleLabel = (role: User['role']) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'pharmacien': return 'Pharmacien';
      case 'assistant': return 'Assistant';
      default: return role;
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Chargement des utilisateurs...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className={cn(
          "p-4 rounded-lg border border-red-500/30",
          "bg-red-500/10 text-red-700"
        )}>
          <h3 className="font-medium mb-2">Erreur de chargement</h3>
          <p className="text-sm">{error}</p>
          <button
            onClick={loadUsers}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* En-tête et actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h2>
          <p className="text-gray-600">Créez et gérez les comptes utilisateurs ({users.length} utilisateurs)</p>
        </div>
        
        <button
          onClick={() => setShowCreateModal(true)}
          className={cn(
            "flex items-center space-x-2 px-4 py-2 rounded-lg font-medium",
            "bg-gradient-to-r from-blue-600 to-purple-600 text-white",
            "hover:from-blue-700 hover:to-purple-700 transition-all duration-200",
            "shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30"
          )}
        >
          <UserPlus className="w-5 h-5" />
          <span>Créer un utilisateur</span>
        </button>
      </div>

      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Rechercher un utilisateur..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={cn(
            "w-full pl-10 pr-4 py-3 rounded-lg",
            "bg-white/60 backdrop-blur-sm border border-gray-200/50",
            "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50",
            "text-gray-900 placeholder-gray-500"
          )}
        />
      </div>

      {/* Liste des utilisateurs */}
      <div className="space-y-4">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-2">Aucun utilisateur trouvé</div>
            <div className="text-sm text-gray-400">
              {searchTerm ? "Essayez de modifier votre recherche" : "Créez votre premier utilisateur"}
            </div>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className={cn(
                "p-4 rounded-lg border border-gray-200/50",
                "bg-white/60 backdrop-blur-sm hover:bg-white/80",
                "transition-all duration-200",
                !user.actif && "opacity-60 bg-gray-100/50"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Avatar */}
                  <div className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center",
                    "bg-gradient-to-br from-blue-500/20 to-purple-500/20",
                    "border border-blue-500/30"
                  )}>
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  
                  {/* Informations utilisateur */}
                  <div>
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-gray-900">
                        {user.prenom} {user.nom}
                      </h3>
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium border",
                        getRoleColor(user.role)
                      )}>
                        {getRoleLabel(user.role)}
                      </span>
                      {!user.actif && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-700 border border-gray-500/30">
                          Inactif
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Mail className="w-4 h-4" />
                        <span>{user.email}</span>
                      </div>
                      {user.telephone && (
                        <div className="flex items-center space-x-1">
                          <Phone className="w-4 h-4" />
                          <span>{user.telephone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  {user.actif ? (
                    <>
                      <button 
                        onClick={() => handleEditUser(user)}
                        disabled={actionLoading !== null}
                        className={cn(
                          "p-2 rounded-lg transition-all duration-200",
                          "bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30",
                          "text-blue-700 hover:text-blue-800 disabled:opacity-50"
                        )}
                      >
                        {actionLoading === `edit-${user.id}` ? (
                          <div className="w-4 h-4 animate-spin border-2 border-blue-700 border-t-transparent rounded-full" />
                        ) : (
                          <Edit className="w-4 h-4" />
                        )}
                      </button>
                      
                      <button 
                        onClick={() => handleDeleteUser(user.id, `${user.prenom} ${user.nom}`)}
                        disabled={actionLoading !== null}
                        className={cn(
                          "p-2 rounded-lg transition-all duration-200",
                          "bg-red-500/20 hover:bg-red-500/30 border border-red-500/30",
                          "text-red-700 hover:text-red-800 disabled:opacity-50"
                        )}
                      >
                        {actionLoading === `delete-${user.id}` ? (
                          <div className="w-4 h-4 animate-spin border-2 border-red-700 border-t-transparent rounded-full" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => handleReactivateUser(user.id, `${user.prenom} ${user.nom}`)}
                      disabled={actionLoading !== null}
                      className={cn(
                        "p-2 rounded-lg transition-all duration-200",
                        "bg-green-500/20 hover:bg-green-500/30 border border-green-500/30",
                        "text-green-700 hover:text-green-800 disabled:opacity-50"
                      )}
                    >
                      {actionLoading === `reactivate-${user.id}` ? (
                        <div className="w-4 h-4 animate-spin border-2 border-green-700 border-t-transparent rounded-full" />
                      ) : (
                        <RotateCcw className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de création */}
      {showCreateModal && (
        <CreateUserModal 
          onClose={() => setShowCreateModal(false)}
          onUserCreated={handleUserCreated}
        />
      )}

      {/* Modal d'édition */}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onUserUpdated={handleUserUpdated}
        />
      )}
    </div>
  );
}