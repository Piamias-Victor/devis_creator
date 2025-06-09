import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "@/lib/database/supabase";

/**
 * VERSION INTERMÉDIAIRE - Supabase + Types simples
 * Progression vers la version complète
 */

console.log("🚀 AUTH CONFIG AVEC SUPABASE CHARGÉ");

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("🔥 AUTHORIZE APPELÉ avec Supabase");
        console.log("📧 Email:", credentials?.email);
        
        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Credentials manquants");
          return null;
        }

        try {
          // ✅ TEST CONNEXION SUPABASE
          console.log("🗄️ Test connexion Supabase...");
          const testQuery = await supabase.from('users').select('count').limit(1);
          console.log("🗄️ Test résultat:", testQuery);

          // ✅ RECHERCHE UTILISATEUR
          console.log("👤 Recherche utilisateur:", credentials.email);
          const { data: user, error } = await supabase
            .from('users')
            .select('id, email, nom, prenom, role, actif')
            .eq('email', credentials.email)
            .eq('actif', true)
            .single();

          console.log("🔍 Résultat requête:", { user, error });

          if (error) {
            console.log("❌ Erreur Supabase:", error.message);
            return null;
          }

          if (!user) {
            console.log("❌ Utilisateur non trouvé");
            return null;
          }

          console.log("✅ Utilisateur trouvé:", user.email, user.nom);

          // ✅ VÉRIFICATION MOT DE PASSE
          const validPasswords: Record<string, string> = {
            'admin@pharmacie-corte.fr': 'admin123',
            'pharma@corte.fr': 'pharma123', 
            'demo@demo.fr': 'demo123',
            'assistant@corte.fr': 'assistant123'
          };

          if (validPasswords[credentials.email] !== credentials.password) {
            console.log("❌ Mot de passe incorrect");
            console.log("🔑 Attendu:", validPasswords[credentials.email]);
            console.log("🔑 Reçu:", credentials.password);
            return null;
          }

          console.log("✅ Authentification réussie!");
          
          // ✅ RETOUR UTILISATEUR SIMPLIFIÉ
          const authenticatedUser = {
            id: user.id,
            email: user.email,
            name: `${user.prenom || ''} ${user.nom}`.trim(),
            // ✅ Propriétés custom SIMPLES (pas d'interface complexe)
            role: user.role,
            userId: user.id,
            nom: user.nom,
            prenom: user.prenom
          };

          console.log("🎉 Retour utilisateur:", authenticatedUser);
          return authenticatedUser;
          
        } catch (error) {
          console.error("❌ Erreur authentification:", error);
          return null;
        }
      },
    }),
  ],
  
  pages: {
    signIn: "/auth/login",
  },
  
  callbacks: {
    async jwt({ token, user }) {
      console.log("🔄 JWT Callback:", { token, user });
      
      // ✅ ENRICHIR TOKEN si utilisateur présent
      if (user) {
        token.role = (user as any).role;
        token.userId = (user as any).userId;
        token.nom = (user as any).nom;
        token.prenom = (user as any).prenom;
        console.log("✅ Token enrichi:", token);
      }
      
      return token;
    },
    
    async session({ session, token }) {
      console.log("🔄 Session Callback:", { session, token });
      
      // ✅ ENRICHIR SESSION
      if (token && session.user) {
        (session.user as any).id = token.userId;
        (session.user as any).userId = token.userId;
        (session.user as any).role = token.role;
        (session.user as any).nom = token.nom;
        (session.user as any).prenom = token.prenom;
        console.log("✅ Session enrichie:", session);
      }
      
      return session;
    },
  },
  
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 heures
  },
  
  debug: true,
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret",
};