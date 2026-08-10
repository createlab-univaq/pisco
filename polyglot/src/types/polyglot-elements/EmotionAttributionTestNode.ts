import { EmotionAttributionTestNodeData } from "./EmotionAttributionTestNodeData";
import { NODE_TYPE } from "./NodeType";
import { PolyglotNodeBase } from "./PolyglotNodeBase";

export type EmotionAttributionTestNode = PolyglotNodeBase & {
  type: typeof NODE_TYPE.EMOTION_ATTRIBUTION_TEST;
  data: EmotionAttributionTestNodeData;
};