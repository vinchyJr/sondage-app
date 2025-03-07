"use client";

import { useState } from "react";

export default function Home() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  // Fonction pour réinitialiser les filtres
  const resetFilters = () => {
    setSearch("");
    setCategory("");
    setDate("");
  };

  return (
    <div className="p-4">
      <div className="flex items-center space-x-4 mb-4">
        {/* Filtre par catégorie */}
        <select
          className="border p-2 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Toutes les catégories</option>
          <option value="Alimentation">Alimentation</option>
          <option value="Sport">Sport</option>
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
    </div>
  );
}
