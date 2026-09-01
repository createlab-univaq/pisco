// Replace these with the actual local components once you refactor them
import icon from '@public/eyes_icon.png';
import EyesTaskNodeProperties from './EyesTaskNodeProperties';
import ReactFlowEyesTaskNode from './ReactFlowEyesTaskNode';
import { NODE_TYPE } from '@/types/NodeType';

export * from './types';
export { EyesTaskNodeProperties, ReactFlowEyesTaskNode };

const newId = (prefix: string) =>
    globalThis.crypto?.randomUUID?.() ??
    `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;

export const eyesTaskNodeConfig = {
    elementType: NODE_TYPE.EYES_TASK,
    name: 'Eyes Task',
    icon: icon.src,
    group: 'remember_assessment',

    propertiesComponent: EyesTaskNodeProperties,
    elementComponent: ReactFlowEyesTaskNode,
    defaultData: {
        nodeData: {},
        minCorrectToPass: 0, // default
        questions: [],
    },
};