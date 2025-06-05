export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          id: string
          nom: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          nom: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          nom?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          adresse: string
          created_at: string | null
          email: string
          id: string
          nom: string
          siret: string
          telephone: string
          updated_at: string | null
        }
        Insert: {
          adresse: string
          created_at?: string | null
          email: string
          id?: string
          nom: string
          siret: string
          telephone: string
          updated_at?: string | null
        }
        Update: {
          adresse?: string
          created_at?: string | null
          email?: string
          id?: string
          nom?: string
          siret?: string
          telephone?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      devis: {
        Row: {
          client_id: string | null
          created_at: string | null
          date_creation: string
          date_validite: string
          id: string
          marge_globale_euros: number | null
          marge_globale_pourcent: number | null
          notes: string | null
          numero: string
          status: string | null
          total_ht: number | null
          total_ttc: number | null
          total_tva: number | null
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          date_creation: string
          date_validite: string
          id?: string
          marge_globale_euros?: number | null
          marge_globale_pourcent?: number | null
          notes?: string | null
          numero: string
          status?: string | null
          total_ht?: number | null
          total_ttc?: number | null
          total_tva?: number | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          date_creation?: string
          date_validite?: string
          id?: string
          marge_globale_euros?: number | null
          marge_globale_pourcent?: number | null
          notes?: string | null
          numero?: string
          status?: string | null
          total_ht?: number | null
          total_ttc?: number | null
          total_tva?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "devis_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      lignes_devis: {
        Row: {
          created_at: string | null
          devis_id: string | null
          id: string
          marge_euros: number | null
          marge_pourcent: number | null
          prix_achat: number | null
          prix_apres_remise: number | null
          prix_unitaire: number
          produit_id: string | null
          quantite: number
          remise: number | null
          total_ht: number | null
          total_ttc: number | null
          total_tva: number | null
          tva: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          devis_id?: string | null
          id?: string
          marge_euros?: number | null
          marge_pourcent?: number | null
          prix_achat?: number | null
          prix_apres_remise?: number | null
          prix_unitaire: number
          produit_id?: string | null
          quantite?: number
          remise?: number | null
          total_ht?: number | null
          total_ttc?: number | null
          total_tva?: number | null
          tva?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          devis_id?: string | null
          id?: string
          marge_euros?: number | null
          marge_pourcent?: number | null
          prix_achat?: number | null
          prix_apres_remise?: number | null
          prix_unitaire?: number
          produit_id?: string | null
          quantite?: number
          remise?: number | null
          total_ht?: number | null
          total_ttc?: number | null
          total_tva?: number | null
          tva?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lignes_devis_devis_id_fkey"
            columns: ["devis_id"]
            isOneToOne: false
            referencedRelation: "devis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lignes_devis_produit_id_fkey"
            columns: ["produit_id"]
            isOneToOne: false
            referencedRelation: "produits"
            referencedColumns: ["id"]
          },
        ]
      }
      produits: {
        Row: {
          categorie_id: string | null
          code: string
          colissage: number | null
          created_at: string | null
          designation: string
          id: string
          prix_achat: number
          prix_vente: number
          tva: number | null
          updated_at: string | null
        }
        Insert: {
          categorie_id?: string | null
          code: string
          colissage?: number | null
          created_at?: string | null
          designation: string
          id?: string
          prix_achat: number
          prix_vente: number
          tva?: number | null
          updated_at?: string | null
        }
        Update: {
          categorie_id?: string | null
          code?: string
          colissage?: number | null
          created_at?: string | null
          designation?: string
          id?: string
          prix_achat?: number
          prix_vente?: number
          tva?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "produits_categorie_id_fkey"
            columns: ["categorie_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
