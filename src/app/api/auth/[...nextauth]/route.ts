import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";

/**
 * Route API NextAuth CORRIGÉE
 * Utilise authOptions au lieu de authConfig
 */
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };