"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar, Check, Edit, Tag, Trash } from "lucide-react"; 

export default function SurveyDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [survey, setSurvey] = useState(null);
  const [responses, setResponses] = useState([]);
  const [hasResponded, setHasResponded] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit } = useForm();

  useEffect(() => {
    if (!id) return;

    const fetchSurvey = async () => {
      try {
        const res = await fetch(`/api/surveys/${id}`);
        const data = await res.json();
        if (res.ok) {
          setSurvey(data);
          setIsCreator(session?.user?.id === data.createdBy);
          if (session?.user?.id === data.createdBy) fetchResponses();
        } else {
          setError(data.error || "Erreur inconnue");
        }
      } catch {
        setError("Erreur serveur");
      }
    };

    const checkIfUserResponded = async () => {
      if (!session) return;
      try {
        const res = await fetch(`/api/responses/${id}`);
        const data = await res.json();
        if (res.ok && data.hasResponded) setHasResponded(true);
      } catch {}
    };

    const fetchResponses = async () => {
      try {
        const res = await fetch(`/api/responses/${id}`);
        const data = await res.json();
        if (res.ok) setResponses(data);
      } catch {}
    };

    fetchSurvey();
    if (session) checkIfUserResponded();
  }, [id, session]);

  const onSubmit = async (data) => {
    if (!session) {
      router.push("/login");
      return;
    }

    const formattedResponses = Object.values(data.responses);
    try {
      const res = await fetch(`/api/responses/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responses: formattedResponses }),
      });

      if (res.ok) setHasResponded(true);
    } catch {}
  };

  const handleDelete = async () => {
    const confirmDelete = confirm("Êtes-vous sûr de vouloir supprimer ce sondage ?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/surveys/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("Sondage supprimé avec succès !");
        router.push("/");
      } else {
        alert("Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur suppression sondage :", error);
    }
  };

  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!survey) return <p className="text-center">Chargement...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>{survey.title}</CardTitle>
          {isCreator && (
            <div className="flex gap-3">
              <Button onClick={() => router.push(`/edit-survey/${id}`)} className="flex items-center gap-2">
                <Edit className="w-4 h-4" /> Modifier
              </Button>
              <Button onClick={handleDelete} variant="destructive" className="flex items-center gap-2">
                <Trash className="w-4 h-4" /> Supprimer
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
        <div className="flex items-center gap-2 text-sm text-gray-600">
        <Calendar className="w-4 h-4" />
          <p className="text-sm text-gray-600"> {new Date(survey.date).toLocaleDateString()}</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
          <Tag className="w-4 h-4" />
          <p className="text-sm text-gray-500"> {survey.category}</p>
          </div>
        </CardContent>
      </Card>

      {/* FORMULAIRE DE RÉPONSE */}
      {!isCreator && !hasResponded && (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          {survey.questions.map((q, index) => (
            <div key={index} className="border p-4 rounded">
              <p className="font-semibold">{q.question}</p>
              {q.type === "ouverte" ? (
                <Input type="text" {...register(`responses.${index}`)} />
              ) : (
                <select {...register(`responses.${index}`)} className="border p-2 rounded w-full">
                  {q.options.map((option, oIndex) => (
                    <option key={oIndex} value={option}>{option}</option>
                  ))}
                </select>
              )}
            </div>
          ))}
          <Button type="submit" className="w-full mt-4">Envoyer</Button>
        </form>
      )}
      {hasResponded && <p className="text-green-600 text-center mt-4">  <Check className="w-6 h-6 text-green-600" />
        Vous avez déjà répondu</p>}

      {/* AFFICHAGE DES RÉPONSES SI L'UTILISATEUR EST LE CRÉATEUR */}
      {isCreator && responses.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 justify-items-center">          <Tag className="w-12 h-12" />
          Réponses</h2>
          <Card className="p-4 bg-gray-100">
            <ul>
              {responses.map((resp) => (
                <li key={resp._id} className="p-2 border-b">
                  <p className="font-bold">{resp.userId.name} ({resp.userId.email})</p>
                  {resp.responses.map((answer, index) => (
                    <p key={index}>
                      <span className="font-semibold">Q{index + 1}:</span> {answer.answer}
                    </p>
                  ))}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </div>
  );
}
