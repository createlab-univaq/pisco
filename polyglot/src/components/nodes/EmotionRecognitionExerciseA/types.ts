import { NODE_TYPE } from '@/types/NodeType';
import { PolyglotNodeBase } from '@/types/PolyglotNodeBase';

export type EmotionRecognitionExerciseANodeData = {
    nodeData: Record<string, any>;
    imageId?: string;
    answers: string[];
    correctIndex: number;
};

export type EmotionRecognitionExerciseANode = PolyglotNodeBase & {
    type: typeof NODE_TYPE.EMOTION_RECOGNITION_EXERCISE_A;
    data: EmotionRecognitionExerciseANodeData;
};