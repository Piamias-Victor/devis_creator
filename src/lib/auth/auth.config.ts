import type { AuthOptions, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

/**
 * Configuration NextAuth CORRIGÉE v2
 * Fix des erreurs TypeScript et import
 */

// Types locaux pour éviter les erreurs
interface CustomUser extends User {
  role: string;
}

interface CustomJWT extends JWT {
  role?: string;
}

// Base utilisateurs
const AUTHORIZED_USERS = [
  {
    id: "1",
    email: "admin@pharmacie-corte.fr",
    password: "admin123",
    name: "Administrateur Pharmacie",
    role: "admin"
  },
  {
    id: "2", 
    email: "pharma@corte.fr",
    password: "pharma123",
    name: "Pharmacien",
    role: "pharmacien"
  },
  {
    id: "3",
    email: "demo@demo.fr", 
    password: "demo123",
    name: "Compte Démonstration",
    role: "demo"
  }
];

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { 
          label: "Email", 
          type: "email",
          placeholder: "demo@demo.fr"
        },
        password: { 
          label: "Mot de passe", 
          type: "password",
          placeholder: "demo123"
        },
      },
      
      async authorize(credentials): Promise<CustomUser | null> {
        console.log("🔍 Tentative de connexion:", credentials?.email);
        
        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Credentials manquants");
          return null;
        }

        // Recherche utilisateur
        const user = AUTHORIZED_USERS.find(
          u => u.email === credentials.email && u.password === credentials.password
        );

        if (user) {
          console.log("✅ Utilisateur trouvé:", user.email);
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        }

        console.log("❌ Utilisateur non trouvé");
        return null;
      },
    }),
  ],
  
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  
  callbacks: {
    async jwt({ token, user }: { token: CustomJWT; user?: CustomUser }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    
    async session({ session, token }: { session: any; token: CustomJWT }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 heures
  },
  
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
};