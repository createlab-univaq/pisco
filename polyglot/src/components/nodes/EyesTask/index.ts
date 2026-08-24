// Replace these with the actual local components once you refactor them
import icon from '@public/icona_occhi.png';
import EyesTaskNodeProperties from './EyesTaskNodeProperties';
import ReactFlowEyesTaskNode from './ReactFlowEyesTaskNode';

const newId = (prefix: string) =>
    globalThis.crypto?.randomUUID?.() ??
    `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;

export const eyesTaskNodeConfig = {
    elementType: 'EyesTaskNode',
    name: 'Eyes Task',
    icon: icon.src,
    group: 'remember_assessment',
    platform: 'WebApp',
    propertiesComponent: EyesTaskNodeProperties,
    elementComponent: ReactFlowEyesTaskNode,
    defaultData: {
        nodeData: {},
        minCorrectToPass: 0, // default
        questions: [
            {
                qid: newId('q'),
                answers: ['', '', '', ''],
                correctIndex: 0,
            },
        ],
    },
};