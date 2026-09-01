import icon from '@public/emotion_icon.png';
import EmotionAttributionExerciseBNodeProperties from './EmotionAttributionExerciseBNodeProperties';
import ReactFlowEmotionAttributionExerciseBNode from './ReactFlowEmotionAttributionExerciseBNode';
import { NODE_TYPE } from '@/types/NodeType';

export * from './types';
export { EmotionAttributionExerciseBNodeProperties, ReactFlowEmotionAttributionExerciseBNode };

export const emotionAttributionExerciseBNodeConfig = {
    elementType: NODE_TYPE.EMOTION_ATTRIBUTION_EXERCISE_B,
    name: 'Emotion Attribution Exercise (B)',
    icon: icon.src,
    group: 'remember_assessment',
    propertiesComponent: EmotionAttributionExerciseBNodeProperties,
    elementComponent: ReactFlowEmotionAttributionExerciseBNode,
    defaultData: {
        nodeData: {},
        items: [],
    },
};