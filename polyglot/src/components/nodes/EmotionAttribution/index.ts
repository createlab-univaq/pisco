import icon from '@public/emotion_icon.png';
import EmotionAttributionNodeProperties from './EmotionAttributionNodeProperties';
import ReactFlowEmotionAttributionNode from './ReactFlowEmotionAttributionNode';
import { NODE_TYPE } from '@/types/NodeType';

export * from './types';
export { EmotionAttributionNodeProperties, ReactFlowEmotionAttributionNode };

const newId = (prefix: string) =>
    globalThis.crypto?.randomUUID?.() ??
    `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;

// Export the configuration object (do NOT call registerMapping here)
export const emotionAttributionNodeConfig = {
    elementType: NODE_TYPE.EMOTION_ATTRIBUTION,
    name: 'Emotion Attribution',
    icon: icon.src,
    group: 'remember_assessment',
    propertiesComponent: EmotionAttributionNodeProperties,
    elementComponent: ReactFlowEmotionAttributionNode,
    defaultData: {
        nodeData: {},
        questions: [],
    },
};