import { NODE_TYPE } from '@/types/NodeType';
import icon from '@public/eyes_icon.png';
import EmotionRecognitionExerciseANodeProperties from './EmotionRecognitionExerciseANodeProperties';
import ReactFlowEmotionRecognitionExerciseANode from './ReactFlowEmotionRecognitionExerciseANode';

export * from './types';
export { EmotionRecognitionExerciseANodeProperties, ReactFlowEmotionRecognitionExerciseANode };

export const emotionRecognitionExerciseANodeConfig = {
    elementType: NODE_TYPE.EMOTION_RECOGNITION_EXERCISE_A,
    name: 'Emotion Recognition Exercise (A)',
    icon: icon.src,
    isExercise: true,
    propertiesComponent: EmotionRecognitionExerciseANodeProperties,
    elementComponent: ReactFlowEmotionRecognitionExerciseANode,
    defaultData: {},
};