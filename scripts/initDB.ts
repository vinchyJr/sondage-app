import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../src/models/User.js";
import Survey from "../src/models/Survey.js";
import ResponseModel from "@/models/Response.js";


dotenv.config();
const MONGO_URI = process.env.MONGODB_URI as string;

if (!MONGO_URI) {
  console.error("❌ MONGODB_URI non définie dans .env.local");
  process.exit(1);
}

const seedDatabase = async () => {
  try {
    console.log("📡 Connexion à MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connecté à MongoDB !");

    // Vider les collections existantes pour éviter les doublons
    await User.deleteMany({});
    await Survey.deleteMany({});
    await ResponseModel.deleteMany({});
    console.log("🧹 Collections nettoyées.");

    // 🔹 Création d'utilisateurs de test
    const hashedPassword = bcrypt.hashSync("password123", 10);

    const users = await User.insertMany([
      { name: "Alice Dupont", email: "alice@example.com", password: hashedPassword },
      { name: "Bob Martin", email: "bob@example.com", password: hashedPassword },
    ]);
    console.log("👤 Utilisateurs insérés :", users.length);

    // 🔹 Création de sondages de test
    const surveys = await Survey.insertMany([
      {
        title: "Préférences alimentaires",
        category: "Alimentation",
        createdBy: users[0]._id,
        date: new Date(),
        questions: [
          { question: "Quel est votre plat préféré ?", type: "ouverte", options: [] },
          { question: "Quel type de cuisine aimez-vous ?", type: "qcm", options: ["Italienne", "Mexicaine", "Chinoise"] },
        ],
      },
      {
        title: "Technologie et gadgets",
        category: "Technologie",
        createdBy: users[1]._id,
        date: new Date(),
        questions: [
          { question: "Quel est votre smartphone préféré ?", type: "ouverte", options: [] },
          { question: "Quel OS utilisez-vous ?", type: "qcm", options: ["Windows", "MacOS", "Linux"] },
        ],
      },
    ]);
    console.log("📊 Sondages insérés :", surveys.length);

    // 🔹 Ajout de réponses de test
    await ResponseModel.insertMany([
      {
        surveyId: surveys[0]._id,
        userId: users[1]._id,
        responses: [
          { questionId: surveys[0].questions[0]._id, answer: "Pizza" },
          { questionId: surveys[0].questions[1]._id, answer: "Italienne" },
        ],
      },
      {
        surveyId: surveys[1]._id,
        userId: users[0]._id,
        responses: [
          { questionId: surveys[1].questions[0]._id, answer: "iPhone 14" },
          { questionId: surveys[1].questions[1]._id, answer: "MacOS" },
        ],
      },
    ]);
    console.log("📋 Réponses insérées.");

    console.log("🎉 Base de données initialisée avec succès !");
    process.exit();
  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation :", error);
    process.exit(1);
  }
};

seedDatabase();
