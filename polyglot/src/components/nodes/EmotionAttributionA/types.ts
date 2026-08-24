import { NODE_TYPE } from "@/types/polyglot-elements/NodeType";
import { PolyglotNodeBase } from "@/types/polyglot-elements/PolyglotNodeBase";

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