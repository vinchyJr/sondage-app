import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI n'est pas défini dans .env.local !");
}

export const connectToDatabase = async () => {
  if (mongoose.connection.readyState >= 1) return;
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any);
    console.log("✅ Connecté à MongoDB !");
  } catch (error) {
    console.error("❌ Erreur de connexion MongoDB :", error);
    throw new Error("Impossible de se connecter à MongoDB");
  }
};
