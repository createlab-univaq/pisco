import { ContainerNode } from "@/components/nodes/Container";
import { EmotionAttributionNode } from "@/components/nodes/EmotionAttribution";
import { EmotionAttributionANode } from "@/components/nodes/EmotionAttributionA";
import { EmotionAttributionBNode } from "@/components/nodes/EmotionAttributionB";
import { EmotionRecognitionNode } from "@/components/nodes/EmotionRecognition";
import { EyesTaskNode } from "@/components/nodes/EyesTask";
import { FauxPasNode } from "@/components/nodes/FauxPas";
import { SocialSituationsNode } from "@/components/nodes/SocialSituations";
import { SocialSituationsExerciseANode } from "@/components/nodes/SocialSituationsExerciseA";
import { TheoryOfMindNode } from "@/components/nodes/TheoryOfMind";
import { TrueFalseNode } from "@/components/nodes/TrueFalse";
import { PolyglotNodeBase } from "./PolyglotNodeBase";

export type PolyglotNode =
  | ContainerNode
  | EmotionAttributionNode
  | EmotionAttributionANode
  | EmotionAttributionBNode
  | EyesTaskNode
  | FauxPasNode
  | EmotionRecognitionNode
  | SocialSituationsNode
  | SocialSituationsExerciseANode
  | TheoryOfMindNode
  | TrueFalseNode
  | (PolyglotNodeBase & {
    type: string;
    data: {
      nodeData: Record<string, any>;
    }
  });