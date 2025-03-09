import mongoose, { Schema, Document, Types } from "mongoose";

/**
 * Interface TypeScript pour les réponses stockées dans MongoDB
 */
export interface IResponse extends Document {
  surveyId: Types.ObjectId;
  userId: Types.ObjectId;
  responses: {
    questionId: Types.ObjectId;
    answer: string;
  }[];
  createdAt: Date;
}

/**
 * Schéma Mongoose pour stocker les réponses des sondages
 */
const ResponseSchema = new Schema<IResponse>(
  {
    surveyId: { type: Schema.Types.ObjectId, ref: "Survey", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    responses: [
      {
        questionId: { type: Schema.Types.ObjectId, required: true },
        answer: { type: String, required: true },
      },
    ],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

/**
 * Exportation du modèle en s'assurant qu'il est unique
 */
const ResponseModel =
  mongoose.models.Response || mongoose.model<IResponse>("Response", ResponseSchema);

export default ResponseModel;
