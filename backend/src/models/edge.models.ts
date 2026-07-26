import mongoose, { model, Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import validator from "validator";
import { PolyglotEdge, PolyglotNode } from "../types";
import { Int8 } from "../types/mongoose/customTypes";

const options = { discriminatorKey: "type" };

const EDGE_TYPES = ["CustomValidation", "ExactValue", "PassFail"];

export interface PolyglotEdgeDocument extends PolyglotEdge, Document {
  minify(): unknown;
}

export interface PolyglotEdgeModel extends Model<PolyglotEdge> {}

export const edgeSchema = new mongoose.Schema<PolyglotEdge>(
  {
    _id: {
      type: String,
      required: true,
      default: () => uuidv4(),
      validate: {
        validator: (id: string) => validator.isUUID(id),
        message: "Invalid UUID-v4",
      },
    },
    code: {
      type: String,
    },
    title: {
      type: String,
      default: "",
    },
    reactFlow: { type: {} },
  },
  options,
);

// Serve per modificare l'output delle query (da valutare il possibile utilizzo)
// edgeSchema.methods.minify = async function(this: PolyglotEdgeDocument) {
//     const response: PolyglotNode = {
//         _id: this._id,
//         type: this.type,
//         title: this.title,
//         description: this.description,
//         _data: this._data,
//         difficulty: this.difficulty,
//         _reactFlow: this._reactFlow
//     }
//     return response;
// }

export const customValidationEdgeSchema = new mongoose.Schema(
  {
    data: {
      code: { type: String },
    },
  },
  options,
);

export const exactValueEdgeSchema = new mongoose.Schema(
  {
    data: {
      value: { type: String },
    },
  },
  options,
);

export const passFailEdgeSchema = new mongoose.Schema(
  {
    data: {
      conditionKind: { type: String, enum: ["pass", "fail"] },
    },
  },
  options,
);

export const manuallyProgressEdgeSchema = new mongoose.Schema(
  {
    data: {
      conditionKind: { type: String, enum: ["pass", "fail"] },
    },
  },
  options,
);

export const failDebtEdgeSchema = new mongoose.Schema(
  {
    data: {
      conditionKind: { type: String, enum: ["fail"] },
      material: { type: String },
      macroSubject: { type: String },
      topic: { type: { Topic: String, description: String, Type: Number } },
      learningObjective: { type: String },
      title: { type: String },
      language: { type: String },
      level: { type: Number },
      temperature: { type: Number },
      typeOfExercise: { type: Number },
      assignmentType: { type: Number },
      bloomLevel: { type: Number },
    },
  },
  options,
);

export const unconditionalEdgeSchema = new mongoose.Schema(
  {
    data: {},
  },
  options,
);

export const conditionalEdgeSchema = new mongoose.Schema(
  {
    data: {
      operator: { type: String, enum: ['>', '>=', '<', '<=', '=='], required: true },
      threshold: { type: Number, required: true },
    },
  },
  options,
);


export const PolyglotEdgeModel = model<PolyglotEdge, PolyglotEdgeModel>(
  "Edge",
  edgeSchema,
);

export const CustomValidationEdge = PolyglotEdgeModel.discriminator(
  "customValidationEdge",
  customValidationEdgeSchema,
);

export const ExactValueEdge = PolyglotEdgeModel.discriminator(
  "exactValueEdge",
  exactValueEdgeSchema,
);

export const PassFailEdge = PolyglotEdgeModel.discriminator(
  "passFailEdge",
  passFailEdgeSchema,
);

export const FailDebtEdge = PolyglotEdgeModel.discriminator(
  "failDebtEdge",
  failDebtEdgeSchema,
);

export const ManuallyProgressEdge = PolyglotEdgeModel.discriminator(
  "manuallyProgressEdge",
  manuallyProgressEdgeSchema,
);

export const UnconditionalEdge = PolyglotEdgeModel.discriminator(
  "unconditionalEdge",
  unconditionalEdgeSchema,
);

export const ConditionalEdge = PolyglotEdgeModel.discriminator(
  'conditionalEdge',
  conditionalEdgeSchema,
);