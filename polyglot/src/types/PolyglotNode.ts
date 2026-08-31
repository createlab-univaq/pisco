import { ContainerNode } from "@/components/nodes/Container";
import { EmotionAttributionNode } from "@/components/nodes/EmotionAttribution";
import { EmotionAttributionExerciseANode } from "@/components/nodes/EmotionAttributionExerciseA";
import { EmotionAttributionExerciseBNode } from "@/components/nodes/EmotionAttributionExerciseB";
import { EmotionRecognitionExerciseANode } from "@/components/nodes/EmotionRecognitionExerciseA";
import { EyesTaskNode } from "@/components/nodes/EyesTask";
import { FauxPasNode } from "@/components/nodes/FauxPas";
import { SocialSituationsNode } from "@/components/nodes/SocialSituations";
import { SocialSituationsExerciseANode } from "@/components/nodes/SocialSituationsExerciseA";
import { TheoryOfMindNode } from "@/components/nodes/TheoryOfMind";
import { TrueFalseNode } from "@/components/nodes/TrueFalse";
import { PolyglotNodeBase } from "./PolyglotNodeBase";
import { FauxPasExerciseANode } from "@/components/nodes/FauxPasExerciseA";
import { TheoryOfMindExerciseANode } from "@/components/nodes/TheoryOfMindExerciseA";

export type PolyglotNode =
  | ContainerNode
  | EmotionAttributionNode
  | EmotionAttributionExerciseANode
  | EmotionAttributionExerciseBNode
  | EyesTaskNode
  | FauxPasNode
  | FauxPasExerciseANode
  | EmotionRecognitionExerciseANode
  | SocialSituationsNode
  | SocialSituationsExerciseANode
  | TheoryOfMindNode
  | TheoryOfMindExerciseANode
  | TrueFalseNode
  | (PolyglotNodeBase & {
    type: string;
    data: {
      nodeData: Record<string, any>;
    }
  });