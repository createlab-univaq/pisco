import { NODE_TYPE } from "@/types/NodeType";
import { PolyglotNodeBase } from "@/types/PolyglotNodeBase";

export type EmotionAttributionBItem = {
    qid?: string;
    emotion?: string;
    scenario?: string;
    explanation?: string;
};

export type EmotionAttributionBNodeData = {
    nodeData: Record<string, any>;
    items: EmotionAttributionBItem[]
};

export type EmotionAttributionBNode = PolyglotNodeBase & {
    type: typeof NODE_TYPE.EMOTION_ATTRIBUTION_B;
    data: EmotionAttributionBNodeData;
};