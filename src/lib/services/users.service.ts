import { User, UserCreateInput } from "@/types";

/**
 * Service de gestion des utilisateurs
 * Interface avec l'API backend
 */

export interface CreateUserRequest extends UserCreateInput {
  password: string;
}

export interface UsersResponse {
  users: User[];
}

export interface UserResponse {
  user: User;
}

export interface ApiError {
  error: string;
}

/**
 * Service principal de gestion des utilisateurs
 */
export class UsersService {
  private static baseUrl = '/api/users';

  /**
   * Récupérer la liste des utilisateurs
   */
  static async getUsers(): Promise<User[]> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.error || 'Erreur lors de la récupération des utilisateurs');
      }

      const data: UsersResponse = await response.json();
      return data.users;

    } catch (error) {
      console.error('Erreur getUsers:', error);
      throw error;
    }
  }

  /**
   * Créer un nouvel utilisateur
   */
  static async createUser(userData: CreateUserRequest): Promise<User> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.error || 'Erreur lors de la création de l\'utilisateur');
      }

      const data: UserResponse = await response.json();
      return data.user;

    } catch (error) {
      console.error('Erreur createUser:', error);
      throw error;
    }
  }

  /**
   * Modifier un utilisateur existant
   */
  static async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: userId, ...userData }),
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.error || 'Erreur lors de la modification de l\'utilisateur');
      }

      const data: UserResponse = await response.json();
      return data.user;

    } catch (error) {
      console.error('Erreur updateUser:', error);
      throw error;
    }
  }

  /**
   * Supprimer un utilisateur (soft delete)
   */
  static async deleteUser(userId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}?id=${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.error || 'Erreur lors de la suppression de l\'utilisateur');
      }

    } catch (error) {
      console.error('Erreur deleteUser:', error);
      throw error;
    }
  }

  /**
   * Réactiver un utilisateur
   */
  static async reactivateUser(userId: string): Promise<User> {
    try {
      return await this.updateUser(userId, { actif: true });
    } catch (error) {
      console.error('Erreur reactivateUser:', error);
      throw error;
    }
  }

  /**
   * Désactiver un utilisateur
   */
  static async deactivateUser(userId: string): Promise<User> {
    try {
      return await this.updateUser(userId, { actif: false });
    } catch (error) {
      console.error('Erreur deactivateUser:', error);
      throw error;
    }
  }
}

/**
 * Hook personnalisé pour la gestion des utilisateurs
 */
export function useUsersService() {
  return {
    getUsers: UsersService.getUsers,
    createUser: UsersService.createUser,
    updateUser: UsersService.updateUser,
    deleteUser: UsersService.deleteUser,
    reactivateUser: UsersService.reactivateUser,
    deactivateUser: UsersService.deactivateUser,
  };
}