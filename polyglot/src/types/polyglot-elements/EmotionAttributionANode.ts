import { EmotionAttributionANodeData } from "./EmotionAttributionANodeData";
import { NODE_TYPE } from "./NodeType";
import { PolyglotNodeBase } from "./PolyglotNodeBase";

export type EmotionAttributionANode = PolyglotNodeBase & {
  type: typeof NODE_TYPE.EMOTION_ATTRIBUTION_A;
  data: EmotionAttributionANodeData;
};