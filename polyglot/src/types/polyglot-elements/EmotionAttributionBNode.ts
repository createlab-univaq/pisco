import { EmotionAttributionBNodeData } from "./EmotionAttributionBNodeData";
import { NODE_TYPE } from "./NodeType";
import { PolyglotNodeBase } from "./PolyglotNodeBase";

export type EmotionAttributionBNode = PolyglotNodeBase & {
  type: typeof NODE_TYPE.EMOTION_ATTRIBUTION_B;
  data: EmotionAttributionBNodeData;
};