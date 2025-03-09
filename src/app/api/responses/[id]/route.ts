import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/app/api/auth/[...nextauth]/authOptions";
import { connectToDatabase } from "@/lib/mongodb";
import Response from "@/models/Response";
import Survey from "@/models/Survey";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    await connectToDatabase();

    const id = req.nextUrl.pathname.split("/").pop();
    if (!id) return NextResponse.json({ error: "ID du sondage non fourni" }, { status: 400 });

    const survey = await Survey.findById(id);
    if (!survey) return NextResponse.json({ error: "Sondage non trouvé" }, { status: 404 });

    if (survey.createdBy.toString() !== session.user.id) {
      return NextResponse.json({ error: "Accès interdit" }, { status: 403 });
    }

    const responses = await Response.find({ surveyId: id }).populate("userId", "name email");
    return NextResponse.json(responses, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Vous devez être connecté pour répondre" }, { status: 401 });

    await connectToDatabase();

    const id = req.nextUrl.pathname.split("/").pop();
    if (!id) return NextResponse.json({ error: "ID du sondage non fourni" }, { status: 400 });

    const survey = await Survey.findById(id);
    if (!survey) return NextResponse.json({ error: "Sondage non trouvé" }, { status: 404 });

    if (survey.createdBy.toString() === session.user.id) {
      return NextResponse.json({ error: "Vous ne pouvez pas répondre à votre propre sondage" }, { status: 403 });
    }

    const existingResponse = await Response.findOne({ surveyId: id, userId: session.user.id });
    if (existingResponse) return NextResponse.json({ error: "Vous avez déjà répondu à ce sondage" }, { status: 403 });

    const { responses } = await req.json();
    if (!Array.isArray(responses)) {
      return NextResponse.json({ error: "Format des réponses invalide" }, { status: 400 });
    }

    const formattedResponses = responses.map((response, index) => ({
      questionId: survey.questions[index]._id,
      answer: response,
    }));

    const newResponse = new Response({
      surveyId: id,
      userId: session.user.id,
      responses: formattedResponses,
    });

    await newResponse.save();
    return NextResponse.json({ message: "Réponse enregistrée" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
