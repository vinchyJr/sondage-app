"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Calendar, Tag } from "lucide-react";

export default function Home() {
  const [surveys, setSurveys] = useState([]);
  const [filteredSurveys, setFilteredSurveys] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const router = useRouter();

  // Charger les sondages depuis l'API
  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const res = await fetch("/api/surveys");
        const data = await res.json();
        setSurveys(data);
        setFilteredSurveys(data);
      } catch (error) {
        console.error("Erreur chargement sondages :", error);
      }
    };

    fetchSurveys();
  }, []);

  // Filtrer les sondages en fonction des critères
  useEffect(() => {
    let filtered = surveys;

    if (search) {
      filtered = filtered.filter((s) =>
        s.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      filtered = filtered.filter((s) => s.category === category);
    }

    if (date) {
      filtered = filtered.filter((s) => new Date(s.date).toISOString().split("T")[0] === date);
    }

    setFilteredSurveys(filtered);
  }, [search, category, date, surveys]);

  // Réinitialiser les filtres
  const resetFilters = () => {
    setSearch("");
    setCategory("");
    setDate("");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">

<h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
  <BarChart className="w-6 h-6 text-gray-600" />
  Sondages disponibles
</h1>
      <div className="flex items-center space-x-4 mb-4">
        {/* Filtre par catégorie */}
        <select
          className="border p-2 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Toutes les catégories</option>
          <option value="Éducation">Éducation</option>
          <option value="Technologie">Technologie</option>
          <option value="Santé">Santé</option>
          <option value="Voyages">Voyages</option>
          <option value="Business">Business</option>
        </select>

        {/* Barre de recherche */}
        <input
          type="text"
          placeholder="Rechercher un sondage..."
          className="border p-2 w-full rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Filtre par date */}
        <input
          type="date"
          className="border p-2 rounded"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        {/* Bouton Reset */}
        <button
          onClick={resetFilters}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Réinitialiser
        </button>
      </div>

      {/* Affichage des sondages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSurveys.length === 0 ? (
          <p className="text-gray-500 text-center">Aucun sondage trouvé.</p>
        ) : (
          filteredSurveys.map((survey) => (
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
    {new Date(survey.date).toLocaleDateString()}
  </div>
  <div className="flex items-center gap-2 text-sm text-gray-500">
    <Tag className="w-4 h-4" />
    {survey.category}
  </div>
</CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}