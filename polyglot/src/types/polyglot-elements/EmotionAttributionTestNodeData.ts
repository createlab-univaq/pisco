import { EmotionAttributionQuestion } from "./EmotionAttributionQuestion";

export type EmotionAttributionTestNodeData = {
    nodeData: Record<string, any>;
    questions: EmotionAttributionQuestion[];
};