import TrueFalseNodeProperties from './TrueFalseNodeProperties';
import ReactFlowTrueFalseNode from './ReactFlowTrueFalseNode';
import icon from '@public/trueFalse_icon.png';

export * from './types';
export { TrueFalseNodeProperties, ReactFlowTrueFalseNode };

export const trueFalseNodeConfig = {
    elementType: 'TrueFalseNode',
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
        negativePoints: 0,
        positivePoints: 1,
    },
};