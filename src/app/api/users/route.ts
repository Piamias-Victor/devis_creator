import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";
import { supabase } from "@/lib/database/supabase";
import { UserCreateInput, User } from "@/types";

/**
 * API Route /api/users
 * Gestion CRUD des utilisateurs (admin uniquement)
 * VERSION CORRIGÉE - Sans types Supabase stricts
 */

// GET - Liste des utilisateurs
export async function GET(request: NextRequest) {
  try {
    // Vérification authentification et droits admin
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    if (userRole !== 'admin') {
      return NextResponse.json({ error: "Accès refusé - Admin requis" }, { status: 403 });
    }

    // Récupération des utilisateurs - utilisation de rpc ou query directe
    const { data: users, error } = await (supabase as any)
      .from('users')
      .select('id, email, nom, prenom, role, actif, telephone, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Erreur récupération utilisateurs:", error);
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }

    // Transformation des données
    const transformedUsers: User[] = users.map((user: any) => ({
      id: user.id,
      email: user.email,
      nom: user.nom,
      prenom: user.prenom,
      role: user.role,
      actif: user.actif,
      telephone: user.telephone,
      createdAt: new Date(user.created_at),
      updatedAt: new Date(user.updated_at)
    }));

    return NextResponse.json({ users: transformedUsers });

  } catch (error) {
    console.error("Erreur API GET /users:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST - Création d'un utilisateur
export async function POST(request: NextRequest) {
  try {
    // Vérification authentification et droits admin
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    if (userRole !== 'admin') {
      return NextResponse.json({ error: "Accès refusé - Admin requis" }, { status: 403 });
    }

    // Validation des données
    const body = await request.json();
    const { email, nom, prenom, role, telephone, password }: UserCreateInput & { password: string } = body;

    if (!email || !nom || !role || !password) {
      return NextResponse.json({ 
        error: "Champs obligatoires manquants: email, nom, role, password" 
      }, { status: 400 });
    }

    // Validation format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Format email invalide" }, { status: 400 });
    }

    // Validation rôle
    if (!['admin', 'pharmacien', 'assistant'].includes(role)) {
      return NextResponse.json({ error: "Rôle invalide" }, { status: 400 });
    }

    // Vérification unicité email
    const { data: existingUser } = await (supabase as any)
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json({ error: "Cet email est déjà utilisé" }, { status: 409 });
    }

    // Création de l'utilisateur
    const { data: newUser, error } = await (supabase as any)
      .from('users')
      .insert({
        email,
        nom,
        prenom: prenom || null,
        role,
        telephone: telephone || null,
        actif: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('id, email, nom, prenom, role, actif, telephone, created_at, updated_at')
      .single();

    if (error) {
      console.error("Erreur création utilisateur:", error);
      return NextResponse.json({ error: "Erreur lors de la création" }, { status: 500 });
    }

    // Transformation de la réponse
    const transformedUser: User = {
      id: newUser.id,
      email: newUser.email,
      nom: newUser.nom,
      prenom: newUser.prenom,
      role: newUser.role,
      actif: newUser.actif,
      telephone: newUser.telephone,
      createdAt: new Date(newUser.created_at),
      updatedAt: new Date(newUser.updated_at)
    };

    console.log("✅ Utilisateur créé:", transformedUser.email);
    return NextResponse.json({ user: transformedUser }, { status: 201 });

  } catch (error) {
    console.error("Erreur API POST /users:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PUT - Modification d'un utilisateur
export async function PUT(request: NextRequest) {
  try {
    // Vérification authentification et droits admin
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    if (userRole !== 'admin') {
      return NextResponse.json({ error: "Accès refusé - Admin requis" }, { status: 403 });
    }

    const body = await request.json();
    const { id, email, nom, prenom, role, telephone, actif } = body;

    if (!id) {
      return NextResponse.json({ error: "ID utilisateur requis" }, { status: 400 });
    }

    // Mise à jour
    const { data: updatedUser, error } = await (supabase as any)
      .from('users')
      .update({
        email,
        nom,
        prenom,
        role,
        telephone,
        actif,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('id, email, nom, prenom, role, actif, telephone, created_at, updated_at')
      .single();

    if (error) {
      console.error("Erreur modification utilisateur:", error);
      return NextResponse.json({ error: "Erreur lors de la modification" }, { status: 500 });
    }

    const transformedUser: User = {
      id: updatedUser.id,
      email: updatedUser.email,
      nom: updatedUser.nom,
      prenom: updatedUser.prenom,
      role: updatedUser.role,
      actif: updatedUser.actif,
      telephone: updatedUser.telephone,
      createdAt: new Date(updatedUser.created_at),
      updatedAt: new Date(updatedUser.updated_at)
    };

    return NextResponse.json({ user: transformedUser });

  } catch (error) {
    console.error("Erreur API PUT /users:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE - Suppression d'un utilisateur
export async function DELETE(request: NextRequest) {
  try {
    // Vérification authentification et droits admin
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const userRole = (session.user as any).role;
    if (userRole !== 'admin') {
      return NextResponse.json({ error: "Accès refusé - Admin requis" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json({ error: "ID utilisateur requis" }, { status: 400 });
    }

    // Empêcher la suppression de son propre compte
    const currentUserId = (session.user as any).userId;
    if (userId === currentUserId) {
      return NextResponse.json({ 
        error: "Impossible de supprimer votre propre compte" 
      }, { status: 400 });
    }

    // Suppression (soft delete - marquer comme inactif)
    const { error } = await (supabase as any)
      .from('users')
      .update({ 
        actif: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) {
      console.error("Erreur suppression utilisateur:", error);
      return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
    }

    return NextResponse.json({ message: "Utilisateur supprimé avec succès" });

  } catch (error) {
    console.error("Erreur API DELETE /users:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}