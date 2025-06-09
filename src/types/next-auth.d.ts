import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

/**
 * Types NextAuth étendus CORRIGÉS
 * Ajout propriétés utilisateur personnalisées
 */

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      userId: string;    // ✅ AJOUTÉ
      nom: string;       // ✅ AJOUTÉ  
      prenom?: string;   // ✅ AJOUTÉ
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: string;
    userId: string;      // ✅ AJOUTÉ
    nom: string;         // ✅ AJOUTÉ
    prenom?: string;     // ✅ AJOUTÉ
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role?: string;
    userId?: string;     // ✅ AJOUTÉ
    nom?: string;        // ✅ AJOUTÉ
    prenom?: string;     // ✅ AJOUTÉ
  }
}