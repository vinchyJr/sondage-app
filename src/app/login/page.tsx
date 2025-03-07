"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    if (res?.error) {
      setError("Email ou mot de passe incorrect");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="p-6 w-96">
        <h2 className="text-xl font-bold mb-4 text-center">Connexion</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input 
            className="border p-2 w-full mb-2 rounded" 
            type="email" 
            name="email" 
            placeholder="Email" 
            onChange={handleChange} 
            required 
          />
          <input 
            className="border p-2 w-full mb-4 rounded" 
            type="password" 
            name="password" 
            placeholder="Mot de passe" 
            onChange={handleChange} 
            required 
          />
          <button 
            className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 transition" 
            type="submit"
          >
            Se connecter
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          Pas encore de compte ?{" "}
          <Link href="/register" className="text-blue-500 hover:underline">
            S'inscrire
          </Link>
        </p>
      </Card>
    </div>
  );
}
