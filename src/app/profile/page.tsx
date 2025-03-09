"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { BarChart, Calendar, Tag, User } from "lucide-react";


export default function Profile() {
  const { data: session, status } = useSession();
  const [surveys, setSurveys] = useState([]);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchUserSurveys = async () => {
      if (!session?.user?.id) return;
      try {
        const res = await fetch("/api/user/surveys");
        const data = await res.json();

        if (res.ok) {
          setSurveys(data);
        } else {
          setError(data.error || "Erreur inconnue");
        }
      } catch (error) {
        setError("Erreur serveur");
      }
    };

    if (session) {
      fetchUserSurveys();
    }
  }, [session]);

  if (status === "loading") return <p>Chargement...</p>;
  if (!session) return null;

  return (
    <div className="p-6 max-w-4xl mx-auto justify-items-center">
      <h2 className="text-2xl font-bold mb-4 justify-items-center">      <User className="w-12 h-12 text-gray-600" />
      Mon compte</h2>
      <p className="text-gray-600">Email: {session.user.email}</p>

      <button
        className="bg-red-500 text-white px-4 py-2 mt-4 rounded hover:bg-red-600 transition"
        onClick={() => signOut()}
      >
        Se déconnecter
      </button>

      <h3 className="text-xl font-semibold mt-6 justify-items-center ">      
      <BarChart className="w-6 h-6 text-gray-600" />
        Mes sondages
      </h3>
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {surveys.length === 0 ? (
          <p className="text-gray-500 text-center">Aucun sondage créé.</p>
        ) : (
          surveys.map((survey) => (
            <Card
              key={survey._id}
              className="cursor-pointer hover:shadow-lg transition"
              onClick={() => router.push(`/survey/${survey._id}`)}
            >
              <CardHeader>
                <CardTitle>{survey.title}</CardTitle>
              </CardHeader>
              <CardContent>
              <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
                <p className="text-sm text-gray-600">    
                {new Date(survey.date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                <Tag className="w-4 h-4" />
                <p className="text-sm text-gray-500">{survey.category}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
