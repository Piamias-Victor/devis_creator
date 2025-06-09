import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

/**
 * Client Supabase CORRIGÉ
 * Fonctionne côté serveur ET client pour NextAuth
 */

// ✅ VÉRIFICATION VARIABLES STRICTE
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables Supabase manquantes:');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', !!supabaseAnonKey);
  throw new Error('Variables d\'environnement Supabase manquantes');
}

// ✅ CLIENT RÉEL côté serveur ET client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: typeof window !== 'undefined', // Session seulement côté client
    autoRefreshToken: typeof window !== 'undefined',
  },
  // ✅ Configuration pour fonctionner côté serveur (NextAuth)
  global: {
    headers: {
      'apikey': supabaseAnonKey,
    },
  },
});

// ✅ LOG DE DEBUG
console.log('🔧 Supabase client créé côté:', typeof window !== 'undefined' ? 'CLIENT' : 'SERVEUR');

export function handleSupabaseError(error: any): never {
  console.error('Erreur Supabase:', error);
  
  if (error?.code === 'PGRST116') {
    throw new Error('Enregistrement non trouvé');
  }
  
  if (error?.code === '23505') {
    throw new Error('Cet élément existe déjà');
  }
  
  throw new Error(error?.message || 'Erreur de base de données');
}

export async function testConnection(): Promise<boolean> {
  try {
    console.log('🧪 Test connexion Supabase...');
    const { data, error } = await supabase.from('categories').select('count').limit(1);
    
    if (error) {
      console.log('❌ Test connexion échoué:', error.message);
      return false;
    }
    
    console.log('✅ Test connexion réussi');
    return true;
  } catch (err) {
    console.log('❌ Test connexion erreur:', err);
    return false;
  }
}