import { NODE_TYPE } from "@/types/NodeType";
import { PolyglotNodeBase } from "@/types/PolyglotNodeBase";

export type EmotionAttributionANodeData = {
    nodeData: Record<string, any>;
    scenario: string;
    domanda: string;
    risposteCorrette: string[];
    spiegazioneS: string;
    spiegazioneR: string;
};

export type EmotionAttributionANode = PolyglotNodeBase & {
    type: typeof NODE_TYPE.EMOTION_ATTRIBUTION_A;
    data: EmotionAttributionANodeData;
};