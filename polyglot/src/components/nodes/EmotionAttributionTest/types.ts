import { PolyglotNodeBase } from '@/types/polyglot-elements/PolyglotNodeBase';

export type EmotionAttributionQuestion = {
    qid: string;
    narration: string;
    question: string;
    correctAnswers: string[]; // lista
};

export type EmotionAttributionTestNodeData = {
    nodeData: Record<string, any>;
    questions: EmotionAttributionQuestion[];
};

export type EmotionAttributionTestNode = PolyglotNodeBase & {
    type: 'EmotionAttributionTestNode';
    data: EmotionAttributionTestNodeData;
};