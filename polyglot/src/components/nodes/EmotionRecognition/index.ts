import { NODE_TYPE } from '@/types/polyglot-elements/NodeType';
import icon from '@public/eyes_icon.png';
import EmotionRecognitionNodeProperties from './EmotionRecognitionNodeProperties';
import ReactFlowEmotionRecognitionNode from './ReactFlowEmotionRecognitionNode';

export * from './types';
export { EmotionRecognitionNodeProperties, ReactFlowEmotionRecognitionNode };

export const emotionRecognitionNodeConfig = {
    elementType: NODE_TYPE.EMOTION_RECOGNITION,
    name: 'Riconoscimento Emozioni',
    icon: icon.src,
    group: 'remember_assessment',
    platform: 'WebApp',
    propertiesComponent: EmotionRecognitionNodeProperties,
    elementComponent: ReactFlowEmotionRecognitionNode,
    defaultData: {
        nodeData: {},
        imageId: undefined,
        answers: ['', ''],
        correctIndex: 0,
    },
};