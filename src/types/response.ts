import { Types } from "mongoose";

export interface ResponseType {
  _id?: Types.ObjectId;
  surveyId: Types.ObjectId;
  userId: Types.ObjectId;
  responses: {
    questionId: Types.ObjectId;
    answer: string;
  }[];
  createdAt?: Date;
}
