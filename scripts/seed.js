import mongoose from "mongoose";
import dotenv from "dotenv";
import RequestType from "../src/models/RequestType.js";
import connectDB from "../src/config/database.js";

dotenv.config();

const seedRequestTypes = [
  {
    code: "TECH_ISSUE",
    name: "Problème technique",
    description: "Problème lié à une panne ou un dysfonctionnement technique",
    priority: "high",
    category: "Support technique",
    estimatedResponseTime: 4,
  },
  {
    code: "BILLING_QUESTION",
    name: "Question de facturation",
    description: "Demande d'informations ou erreur sur la facturation",
    priority: "medium",
    category: "Facturation",
    estimatedResponseTime: 12,
  },
  {
    code: "ACCOUNT_CHANGE",
    name: "Demande de modification de compte",
    description: "Modification d'informations personnelles ou d'accès",
    priority: "low",
    category: "Gestion de compte",
    estimatedResponseTime: 24,
  },
  {
    code: "FEATURE_REQUEST",
    name: "Demande de fonctionnalité",
    description: "Suggestion d'ajout ou d'amélioration d'une fonctionnalité",
    priority: "medium",
    category: "Amélioration produit",
    estimatedResponseTime: 48,
  },
  {
    code: "CUSTOMER_COMPLAINT",
    name: "Réclamation",
    description: "Plainte ou insatisfaction client concernant un service",
    priority: "critical",
    category: "Service client",
    estimatedResponseTime: 6,
  },
];

const run = async () => {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    await RequestType.deleteMany();
    console.log("Collection vidée");

    await RequestType.insertMany(seedRequestTypes);
    console.log("Données initiales insérées avec succès !");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

run();
