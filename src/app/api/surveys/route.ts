import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import { connectToDatabase } from "@/lib/mongodb";
import Survey from "@/models/Survey";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { title, category, questions } = await req.json();
    await connectToDatabase();

    const newSurvey = new Survey({
      title,
      category,
      date: new Date(), 
      questions,
      createdBy: session.user.id,
    });

    await newSurvey.save();

    return NextResponse.json({ message: "Sondage créé avec succès" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}



export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const surveys = await Survey.find().sort({ date: -1 });

    return NextResponse.json(surveys || [], { status: 200 }); 
  } catch (error) {
    return NextResponse.json([], { status: 500 }); 
  }
}
