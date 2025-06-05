import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variables d\'environnement Supabase manquantes');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

export function handleSupabaseError(error: any): never {
  console.error('Erreur Supabase:', error);
  
  if (error.code === 'PGRST116') {
    throw new Error('Enregistrement non trouvé');
  }
  
  if (error.code === '23505') {
    throw new Error('Cet élément existe déjà');
  }
  
  throw new Error(error.message || 'Erreur de base de données');
}

export async function testConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase.from('categories').select('count').limit(1);
    return !error;
  } catch {
    return false;
  }
}