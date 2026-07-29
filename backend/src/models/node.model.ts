import mongoose, { model, Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import validator from "validator";
import { PolyglotNode } from "../types";
const options = { discriminatorKey: "type" };

export interface PolyglotNodeDocument extends PolyglotNode, Document {
  minify(): unknown;
}

export interface PolyglotNodeModel extends Model<PolyglotNode> {}

export const nodeSchema = new mongoose.Schema<PolyglotNode>(
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
    title: {
      type: String,
      default: "Node",
    },
    description: { type: String },
    difficulty: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
    },
    reactFlow: {
      type: {},
    },
    runtimeData: { type: {} },
    platform: {
      type: String,
      default: "VSCode",
    },
  },
  options,
);
//learning nodes:
export const LessonNodeSchema = new mongoose.Schema(
  {
    data: {
      file: { type: {} },
    },
  },
  options,
);

export const LessonTextNodeSchema = new mongoose.Schema(
  {
    data: {
      text: { type: String },
    },
  },
  options,
);

export const WatchVideoNodeSchema = new mongoose.Schema(
  {
    data: {
      link: { type: String },
    },
  },
  options,
);



//assessment nodes:
export const closeEndedQuestionNodeSchema = new mongoose.Schema(
  {
    data: {
      question: { type: String },
      correctAnswers: [{ type: String }],
      textToFill: { type: String },
      isAnswerCorrect: [{ type: Boolean }],
    },
  },
  options,
);

export const openQuestionNodeSchema = new mongoose.Schema(
  {
    data: {
      question: { type: String },
      material: { type: String },
      possibleAnswer: { type: String },
    },
  },
  options,
);

export const multipleChoiceQuestionNodeSchema = new mongoose.Schema(
  {
    data: {
      question: [{ type: String }],
      choices: [[{ type: String }]],
      isChoiceCorrect: [[{ type: Boolean }]],
    },
  },
  options,
);

export const TrueFalseNodeSchema = new mongoose.Schema(
  {
    data: {
      instructions: { type: String },
      questions: [{ type: String }],
      isQuestionCorrect: [{ type: Boolean }],
      negativePoints: { type: Number },
      positvePoints: { type: Number },
    },
  },
  options,
);


/* Nodo per il Test Eyes Task */
export const EyesTaskTestNodeSchema = new mongoose.Schema(
  {
    data: {
      questions: [
        {
          qid: { type: String },
          imageId: { type: String },
          answers: [{ type: String }],
          correctIndex: { type: Number },
        }
      ]
    }
  },
  options,
);


/* Nodo per il Test attribuzione delle Emozioni */
export const EmotionAttributionTestNodeSchema = new mongoose.Schema(
  {
    data: {
      questions: [
        {
          qid: { type: String },

          narration: { type: String, default: "" },
          question: { type: String, default: "" },

          // Lista di risposte accettate come corrette
          correctAnswers: [{ type: String }],
        },
      ],
    },
  },
  options
);


export const TeoriaDellaMenteNodeSchema = new mongoose.Schema(
  {
    data: {
      quiz: [
        {
          qid: { type: String, required: true },
          narration: { type: String, default: '' },
          questions: [
            {
              question: { type: String, default: '' },
              answers: [{ type: String, default: [] }],
              correctIndex: { type: Number, default: null },
            },
          ],
        },
      ],
    },
  },
  options
);

export const FauxPasNodeSchema = new mongoose.Schema(
  {
    data: {
      quiz: [
        {
          qid: { type: String, required: true },
          narration: { type: String, default: '' },
          questions: [
            {
              question: { type: String, default: '' },
              answers: [{ type: String }],
              correctIndex: {
                type: Number,
                required: true,
                default: 0,
              },

              skipIf: {
                enabled: { type: Boolean, default: false },

                // indice della domanda precedente da controllare
                questionIndex: { type: Number, default: null },

                // indice della risposta che fa scattare lo skip
                answerIndex: { type: Number, default: null },
              },
            },
          ],
        },
      ],
    },
  },
  options
);

const socialSituationsAnswerSchema = new mongoose.Schema(
  {
    text: { type: String, default: " " },
    score: { type: Number, default: 0 },
  },
  { _id: false }
);


/* Nodo: Situazioni sociali (sezioni con grassetto + risposte multi-select) */
export const socialSituationsNodeSchema = new mongoose.Schema(
  {
    data: {
      items: [
        {
          sid: { type: String },

          sections: [
            {
              before: { type: String, default: " " },
              bold: { type: String, default: " " },
              after: { type: String, default: " " },

              answers: { type: [socialSituationsAnswerSchema], default: [] },
              correctIndexes: [{ type: Number }], // multi-select
            },
          ],
        },
      ],
    },
  },
  options
);


export const CircuitNodeSchema = new mongoose.Schema(
  {
    data: {
      instructions: { type: String },
      pinsList: [{ type: {pin: String, value: String} }],
    },
  },
  options,
);

/* Nodo per l'esercitazione attribuzione delle Emozioni tipo A */
export const EmotionAttributionANodeSchema = new mongoose.Schema(
  {
    data: {
      scenario: { type: String, default: "" },
      domanda: { type: String, default: "" },
      risposteCorrette: [{ type: String }],
      spiegazioneS: { type: String, default: "" },
      spiegazioneR: { type: String, default: "" },
    },
  },
  options
);

/* Nodo per l'esercitazione attribuzione delle Emozioni tipo A */
export const EmotionAttributionBNodeSchema = new mongoose.Schema(
  {
    data: {
      items: [
        {
          emotion: { type: String, default: "" },
          scenario: { type: String, default: "" },
          scenarioExplanation: { type: String, default: "" },
        },
      ],      
    },
  },
  options
);

/* Nodo per l'esercitazione Situazioni sociali tipo A */
export const SocialSituationExerciseANodeSchema = new mongoose.Schema(
  {
    data: {
      scenario: { type: String },
      items: [
        {
          type: {
            answer: { type: String },
            explanation: { type: String },
          },
        },
      ],
      correctIndex: { type: Number, default: 0 },
    },
  },
  options,
);

/* Nodo per l'esercitazione attribuzione delle Emozioni tipo A */
export const ContainerNodeSchema = new mongoose.Schema(
  {
    data: {
      sections: {
        type: [
          {
            id: { type: String, required: true },

            items: {
              type: [
                {
                  id: { type: String, required: true },
                  type: { type: String, required: true }, // es: "EmotionAttributionANode"
                  title: { type: String },
                  data: { type: mongoose.Schema.Types.Mixed, default: {} },
                },
              ],
              default: [],
            },
          },
        ],
        default: [],
      },
    },
  },
  options
);

/* Nodo per il Riconoscimento Emozioni */
export const RiconoscimentoEmozioniNodeSchema = new mongoose.Schema(
  {
    data: {
      imageId: { type: String },
      answers: [{ type: String }],
      correctIndex: { type: Number },
    }
  },
  options,
);



export const PolyglotNodeModel = model<PolyglotNode, PolyglotNodeModel>(
  "Node",
  nodeSchema,
);

export const LessonNode = PolyglotNodeModel.discriminator(
  "lessonNode",
  LessonNodeSchema,
);

export const LessonTextNode = PolyglotNodeModel.discriminator(
  "lessonTextNode",
  LessonTextNodeSchema,
);

export const WatchVideoNode = PolyglotNodeModel.discriminator(
  "WatchVideoNode",
  WatchVideoNodeSchema,
);


export const CloseEndedQuestionNode = PolyglotNodeModel.discriminator(
  "closeEndedQuestionNode",
  closeEndedQuestionNodeSchema,
);

export const OpenQuestionNode = PolyglotNodeModel.discriminator(
  "OpenQuestionNode",
  openQuestionNodeSchema,
);


export const MultipleChoiceQuestionNode = PolyglotNodeModel.discriminator(
  "multipleChoiceQuestionNode",
  multipleChoiceQuestionNodeSchema,
);

export const TrueFalseNode = PolyglotNodeModel.discriminator(
  "TrueFalseNode",
  TrueFalseNodeSchema,
);

export const CircuitNode = PolyglotNodeModel.discriminator(
  "CircuitNode",
  CircuitNodeSchema,
);

/* Discriminator per il Test Attribuzione delle Emozioni */
export const EmotionAttributionTestNode = PolyglotNodeModel.discriminator(
  "EmotionAttributionTestNode",
  EmotionAttributionTestNodeSchema,
);

/* Discriminator per il Test Eyes Task */
export const EyesTaskTestNode = PolyglotNodeModel.discriminator(
  "EyesTaskTestNode",
  EyesTaskTestNodeSchema,
);

/* Discriminator per il Test Situazioni Sociali */
export const socialSituationsNode = PolyglotNodeModel.discriminator(
  "socialSituationsNode",
  socialSituationsNodeSchema
);

/* Discriminator per il Test Teoria della mente */
export const TeoriaDellaMenteNode = PolyglotNodeModel.discriminator(
  "TeoriaDellaMenteNode",
  TeoriaDellaMenteNodeSchema
);

/* Discriminator per il Test Teoria della mente */
export const FauxPasNode = PolyglotNodeModel.discriminator(
  "FauxPasNode",
  FauxPasNodeSchema
);

export const ContainerNode = PolyglotNodeModel.discriminator(
  "ContainerNode",
  ContainerNodeSchema,
);

/* Discriminator per l'esercitazione Attribuzione delle Emozioni tipo A */
export const EmotionAttributionANode = PolyglotNodeModel.discriminator(
  "EmotionAttributionANode",
  EmotionAttributionANodeSchema,
);


/* Discriminator per l'esercitazione Attribuzione delle Emozioni tipo A */
export const EmotionAttributionBNode = PolyglotNodeModel.discriminator(
  "EmotionAttributionBNode",
  EmotionAttributionBNodeSchema,
);

/* Discriminator per l'esercitazione Situazioni Sociali */
export const SocialSituationExerciseANode = PolyglotNodeModel.discriminator(
  "SocialSituationExerciseANode",
  SocialSituationExerciseANodeSchema,
);

/* Discriminator per l'esercitazione Riconoscimento Emozioni*/
export const RiconoscimentoEmozioniNode = PolyglotNodeModel.discriminator(
  "RiconoscimentoEmozioniNode",
  RiconoscimentoEmozioniNodeSchema,
);