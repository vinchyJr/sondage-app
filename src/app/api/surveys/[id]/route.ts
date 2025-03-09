import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import { connectToDatabase } from "@/lib/mongodb";
import Survey from "@/models/Survey";
import Response from "@/models/Response";
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      await connectToDatabase();
  
      if (!params || !params.id) {
        return NextResponse.json({ error: "ID du sondage non fourni" }, { status: 400 });
      }  
      const survey = await Survey.findById(params.id);
      if (!survey) {
        return NextResponse.json({ error: "Sondage non trouvé" }, { status: 404 });
      }
  
      return NextResponse.json(survey, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
  }
export async function PUT(req: NextRequest, { params }: { params?: { id?: string } } = {}) {
    try {
      const session = await getServerSession(authOptions);
      if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  
      const { title, category, questions } = await req.json();
      await connectToDatabase();
  
      const survey = await Survey.findById(params.id);
  
      if (!survey || survey.createdBy.toString() !== session.user.id) {
        return NextResponse.json({ error: "Non autorisé à modifier ce sondage" }, { status: 403 });
      }
  
      // Mettre à jour toutes les informations du sondage
      survey.title = title;
      survey.category = category;
      survey.questions = questions;
  
      await survey.save();
  
      return NextResponse.json({ message: "Sondage mis à jour avec succès" }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
  }

// Supprimer un sondage et ses réponses associées
export async function DELETE(req: NextRequest, { params }: { params?: { id?: string } } = {}) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    await connectToDatabase();
    const survey = await Survey.findById(params.id);

    if (!survey || survey.createdBy.toString() !== session.user.id) {
      return NextResponse.json({ error: "Non autorisé à supprimer ce sondage" }, { status: 403 });
    }

    await Survey.deleteOne({ _id: params.id });
    await Response.deleteMany({ surveyId: params.id }); 

    return NextResponse.json({ message: "Sondage supprimé avec succès" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params?: { id?: string } } = {}) {
    try {
      const session = await getServerSession(authOptions);
      if (!session) return NextResponse.json({ error: "Vous devez être connecté pour répondre" }, { status: 401 });
  
      await connectToDatabase();
      
      const survey = await Survey.findById(params.id);
      if (!survey) return NextResponse.json({ error: "Sondage non trouvé" }, { status: 404 });
  
      // Vérifier si l'utilisateur a déjà répondu
      const existingResponse = await Response.findOne({ surveyId: params.id, userId: session.user.id });
      if (existingResponse) {
        return NextResponse.json({ error: "Vous avez déjà répondu à ce sondage" }, { status: 403 });
      }
  
      const { responses } = await req.json();
  
      const newResponse = new Response({
        surveyId: params.id,
        userId: session.user.id,
        responses,
      });
  
      await newResponse.save();
  
      return NextResponse.json({ message: "Réponse enregistrée" }, { status: 201 });
    } catch (error) {
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
  }
