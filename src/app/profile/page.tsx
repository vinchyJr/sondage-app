"use client";

import { signOut, useSession } from "next-auth/react";

export default function Profile() {
  const { data: session } = useSession();

  if (!session) {
    return <p>Non connecté</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Mon compte</h2>
      <p>Email: {session.user?.email}</p>
      <button className="bg-red-500 text-white px-4 py-2 mt-4" onClick={() => signOut()}>
        Se déconnecter
      </button>
    </div>
  );
}
