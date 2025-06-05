import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

// Guard pour éviter l'erreur au build
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Créer un client "dummy" si variables manquantes (build time)
let supabase: any;

if (typeof window !== 'undefined') {
  // Côté client : vérifier les variables
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Variables d\'environnement Supabase manquantes');
  }
  
  supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  });
} else {
  // Côté serveur : client dummy pour le build
  supabase = {
    from: () => ({
      select: () => ({ data: null, error: null }),
      insert: () => ({ data: null, error: null }),
      delete: () => ({ data: null, error: null })
    })
  };
}

export { supabase };

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
  if (typeof window === 'undefined') return false;
  
  try {
    const { data, error } = await supabase.from('categories').select('count').limit(1);
    return !error;
  } catch {
    return false;
  }
}