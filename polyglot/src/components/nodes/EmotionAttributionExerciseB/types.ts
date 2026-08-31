import { NODE_TYPE } from "@/types/NodeType";
import { PolyglotNodeBase } from "@/types/PolyglotNodeBase";

export type EmotionAttributionExerciseBItem = {
    qid?: string;
    emotion?: string;
    scenario?: string;
    explanation?: string;
};

export type EmotionAttributionExerciseBNodeData = {
    nodeData: Record<string, any>;
    items: EmotionAttributionExerciseBItem[]
};

export type EmotionAttributionExerciseBNode = PolyglotNodeBase & {
    type: typeof NODE_TYPE.EMOTION_ATTRIBUTION_EXERCISE_B;
    data: EmotionAttributionExerciseBNodeData;
};