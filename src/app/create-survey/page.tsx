"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { Book, Pencil, Plus, Trash } from "lucide-react";

export default function CreateSurveyPage() {
  const router = useRouter();
  const [existingTitles, setExistingTitles] = useState<string[]>([]);
  const [error, setError] = useState("");

  const categories = ["Éducation", "Technologie", "Santé", "Voyages", "Business"];

  const { register, control, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      title: "",
      category: "",
      questions: [{ question: "", type: "ouverte", options: [] as string[] }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "questions" });

  // Récupérer les titres des sondages existants
  useEffect(() => {
    const fetchExistingTitles = async () => {
      try {
        const res = await fetch("/api/surveys");
        const data = await res.json();
        if (res.ok) {
          setExistingTitles(data.map((survey: any) => survey.title.toLowerCase()));
        }
      } catch (error) {
        console.error("❌ Erreur récupération des sondages :", error);
      }
    };

    fetchExistingTitles();
  }, []);

  const onSubmit = async (data: any) => {
    const formattedData = {
      ...data,
      date: new Date().toISOString(),
    };

    // Vérification de l'unicité du titre (case insensitive)
    if (existingTitles.includes(data.title.toLowerCase())) {
      setError("Ce titre est déjà utilisé. Veuillez en choisir un autre.");
      return;
    }

    const response = await fetch("/api/surveys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formattedData),
    });

    if (response.ok) {
      alert("Sondage créé avec succès !");
      router.push("/");
    } else {
      alert("Erreur lors de la création du sondage");
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Pencil className="w-8 h-8 text-gray-600" />
        Créer un nouveau sondage
      </h1>

      <Card className="p-6">
        <CardHeader>
          <CardTitle className="text-xl">Détails du sondage</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block font-semibold">Titre du sondage</label>
              <Input
                type="text"
                placeholder="Ex : Sondage sur la satisfaction"
                {...register("title", { required: true })}
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>

            <div>
              <label className="block font-semibold">Catégorie</label>
              <Select onValueChange={(value) => setValue("category", value)}>
                <SelectTrigger>
                  <span>{watch("category") || "Choisir une catégorie"}</span>
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block font-semibold">Questions</label>
              {fields.map((field, index) => (
                <div key={field.id} className="border p-4 rounded-lg mb-4">
                  <Input
                    type="text"
                    placeholder="Intitulé de la question"
                    {...register(`questions.${index}.question`, { required: true })}
                  />
                  <Select onValueChange={(value) => setValue(`questions.${index}.type`, value)}>
                    <SelectTrigger>
                      <span>Type : {watch(`questions.${index}.type`) || "Texte libre"}</span>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ouverte">Texte libre</SelectItem>
                      <SelectItem value="qcm">QCM</SelectItem>
                    </SelectContent>
                  </Select>

                  {watch(`questions.${index}.type`) === "qcm" && (
                    <div className="mt-2">
                      <label className="block font-semibold">Options</label>
                      <Input
                        type="text"
                        placeholder="Option 1, Option 2, ..."
                        onChange={(e) =>
                          setValue(`questions.${index}.options`, e.target.value.split(","))
                        }
                      />
                    </div>
                  )}

                  <Button variant="destructive" size="sm" className="mt-2" onClick={() => remove(index)}>
                    <Trash className="w-4 h-4" /> Supprimer
                  </Button>
                </div>
              ))}

              <Button type="button" onClick={() => append({ question: "", type: "ouverte", options: [] })}>
                <Plus className="w-4 h-4" /> Ajouter une question
              </Button>
            </div>

            <Button className="w-full mt-4" type="submit">
              Créer le sondage
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
