import { NODE_TYPE } from "@/types/NodeType";
import { PolyglotNodeBase } from "@/types/PolyglotNodeBase";

export type EmotionAttributionExerciseAData = {
    scenario: string;
    domanda: string;
    risposteCorrette: string[];
    spiegazioneS: string;
    spiegazioneR: string;
};

export type EmotionAttributionExerciseANodeData = {
    nodeData: Record<string, any>;
    scenario: string;
    domanda: string;
    risposteCorrette: string[];
    spiegazioneS: string;
    spiegazioneR: string;
};

export type EmotionAttributionExerciseANode = PolyglotNodeBase & {
    type: typeof NODE_TYPE.EMOTION_ATTRIBUTION_EXERCISE_A;
    data: EmotionAttributionExerciseANodeData;
};