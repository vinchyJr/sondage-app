"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";


export default function Register() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });      

    if (!res.ok) {
      const data = await res.json();
      setError(data.error);
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
        <Card>
      <form className="p-6" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-4">Créer un compte</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input className="border p-2 w-full mb-2" type="text" name="name" placeholder="Pseudo" onChange={handleChange} />
        <input className="border p-2 w-full mb-2" type="email" name="email" placeholder="Email" onChange={handleChange} />
        <input className="border p-2 w-full mb-4" type="password" name="password" placeholder="Mot de passe" onChange={handleChange} />
        <button className="bg-blue-500 text-white p-2 rounded w-full" type="submit">S'inscrire</button>
      </form>
      <p className="text-center text-gray-600 mt-4">
          Déjà un compte ?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Se Connecter
          </Link>
        </p>
        </Card>
    </div>
  );
}
