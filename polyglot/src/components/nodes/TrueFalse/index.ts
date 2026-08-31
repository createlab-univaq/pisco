import TrueFalseNodeProperties from './TrueFalseNodeProperties';
import ReactFlowTrueFalseNode from './ReactFlowTrueFalseNode';
import icon from '@public/trueFalse_icon.png';
import { NODE_TYPE } from '@/types/NodeType';

export * from './types';
export { TrueFalseNodeProperties, ReactFlowTrueFalseNode };

export const trueFalseNodeConfig = {
    elementType: NODE_TYPE.TRUE_FALSE,
    name: 'True False',
    icon: icon.src,
    group: 'remember_assessment',

    propertiesComponent: TrueFalseNodeProperties,
    elementComponent: ReactFlowTrueFalseNode,
    defaultData: {
        nodeData: {},
        instructions: '',
        questions: [],
        isQuestionCorrect: [],
    },
};