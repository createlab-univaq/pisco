import { NODE_TYPE } from '@/types/NodeType';
import { PolyglotNodeBase } from '@/types/PolyglotNodeBase';

export type EmotionAttributionQuestion = {
    qid: string;
    narration: string;
    question: string;
    correctAnswers: string[]; // lista
};

export type EmotionAttributionNodeData = {
    nodeData: Record<string, any>;
    questions: EmotionAttributionQuestion[];
};

export type EmotionAttributionNode = PolyglotNodeBase & {
    type: typeof NODE_TYPE.EMOTION_ATTRIBUTION;
    data: EmotionAttributionNodeData;
};