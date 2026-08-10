import { NODE_TYPE } from "./NodeType";
import { PolyglotNodeBase } from "./PolyglotNodeBase";
import { SocialSituationExerciseANodeData } from "./SocialSituationExerciseANodeData";

export type SocialSituationExerciseANode = PolyglotNodeBase & {
  type: typeof NODE_TYPE.SOCIAL_SITUATION_EXERCISE_A;
  data: SocialSituationExerciseANodeData;
};