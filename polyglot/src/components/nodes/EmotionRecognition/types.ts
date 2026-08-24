import { NODE_TYPE } from '@/types/polyglot-elements/NodeType';
import { PolyglotNodeBase } from '@/types/polyglot-elements/PolyglotNodeBase';

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