import icon from '@public/emotion_icon.png';
import EmotionAttributionExerciseANodeProperties from './EmotionAttributionExerciseANodeProperties';
import ReactFlowEmotionAttributionExerciseANode from './ReactFlowEmotionAttributionExerciseANode';
import { NODE_TYPE } from '@/types/NodeType';

export * from './types';
export { EmotionAttributionExerciseANodeProperties, ReactFlowEmotionAttributionExerciseANode };

export const emotionAttributionExerciseANodeConfig = {
  elementType: NODE_TYPE.EMOTION_ATTRIBUTION_EXERCISE_A,
  name: 'Emotion Attribution Exercise (A)',
  icon: icon.src,
  isExercise: true,
  propertiesComponent: EmotionAttributionExerciseANodeProperties,
  elementComponent: ReactFlowEmotionAttributionExerciseANode,
  defaultData: {
    nodeData: {},
    scenario: '',
    domanda: '',
    risposteCorrette: [],
    spiegazioneS: '',
    spiegazioneR: '',
  },
};