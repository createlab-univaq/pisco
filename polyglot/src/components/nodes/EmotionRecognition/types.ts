import { NODE_TYPE } from '@/types/NodeType';
import { PolyglotNodeBase } from '@/types/PolyglotNodeBase';

export type EmotionRecognitionNodeData = {
    nodeData: Record<string, any>;
    imageId?: string;
    answers: string[];
    correctIndex: number;
};

export type EmotionRecognitionNode = PolyglotNodeBase & {
    type: typeof NODE_TYPE.EMOTION_RECOGNITION;
    data: EmotionRecognitionNodeData;
};