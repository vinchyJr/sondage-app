"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Plus, Trash, Save, Pencil } from "lucide-react";

export default function EditSurveyPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { register, control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      title: "",
      category: "",
      questions: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  useEffect(() => {
    if (!id) return;

    const fetchSurvey = async () => {
      try {
        const res = await fetch(`/api/surveys/${id}`);
        const data = await res.json();
        if (res.ok) {
          if (data.createdBy !== session?.user?.id) {
            router.push("/");
            return;
          }
          setValue("title", data.title);
          setValue("category", data.category);
          setValue("questions", data.questions);
          setLoading(false);
        } else {
          setError(data.error || "Erreur inconnue");
        }
      } catch {
        setError("Erreur serveur");
      }
    };

    fetchSurvey();
  }, [id, session, setValue, router]);

  const onSubmit = async (data) => {
    try {
      const res = await fetch(`/api/surveys/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert("Sondage mis à jour !");
        router.push(`/survey/${id}`);
      } else {
        alert("Erreur lors de la mise à jour");
      }
    } catch {
      alert("Erreur serveur");
    }
  };

  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (loading) return <p className="text-center">Chargement...</p>;

  return (
    <div className="p-6 w-full">
      <Card>
      <CardHeader className="flex items-center gap-2">
  <Pencil className="w-6 h-6 text-gray-600" />
  <CardTitle>Modifier le sondage</CardTitle>
</CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Modifier le titre */}
            <div>
              <label className="block font-semibold">Titre du sondage</label>
              <Input type="text" {...register("title", { required: true })} />
            </div>

            {/* Modifier la catégorie */}
            <div>
              <label className="block font-semibold">Catégorie</label>
              <Select onValueChange={(value) => setValue("category", value)}>
                <SelectTrigger>
                  <span>{watch("category") || "Choisir une catégorie"}</span>
                </SelectTrigger>
                <SelectContent>
                  {["Éducation", "Technologie", "Santé", "Voyages", "Business"].map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Modifier les questions */}
            <div>
              <label className="block font-semibold">Questions</label>
              {fields.map((field, index) => (
                <div key={field.id} className="border p-4 rounded-lg mb-4">
                  <Input type="text" {...register(`questions.${index}.question`, { required: true })} placeholder="Intitulé de la question" />

                  {/* Sélectionner le type de question */}
                  <Select onValueChange={(value) => setValue(`questions.${index}.type`, value)}>
                    <SelectTrigger>
                      <span>Type : {watch(`questions.${index}.type`) || "Texte libre"}</span>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ouverte">Texte libre</SelectItem>
                      <SelectItem value="qcm">QCM</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Gérer les options pour QCM */}
                  {watch(`questions.${index}.type`) === "qcm" && (
                    <div className="mt-2">
                      <label className="block font-semibold">Options (séparées par des virgules)</label>
                      <Input
                        type="text"
                        placeholder="Option 1, Option 2, ..."
                        onChange={(e) => setValue(`questions.${index}.options`, e.target.value.split(","))}
                      />
                    </div>
                  )}

                  {/* Bouton Supprimer une question */}
                  <Button variant="destructive" size="sm" className="mt-2" onClick={() => remove(index)}>
                    <Trash className="w-4 h-4" /> Supprimer
                  </Button>
                </div>
              ))}

              {/* Bouton Ajouter une question */}
              <Button type="button" onClick={() => append({ question: "", type: "ouverte", options: [] })} className="flex items-center gap-2">
                <Plus className="w-4 h-4" /> Ajouter une question
              </Button>
            </div>

            {/* Bouton Enregistrer */}
            <Button className="w-full mt-4 flex items-center gap-2" type="submit">
              <Save className="w-4 h-4" /> Enregistrer les modifications
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
