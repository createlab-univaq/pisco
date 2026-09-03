// Replace these with the actual local components once you refactor them
import icon from '@public/brain_icon.png';
import TheoryOfMindNodeProperties from './TheoryOfMindNodeProperties';
import ReactFlowTheoryOfMindNode from './ReactFlowTheoryOfMindNode';
import { NODE_TYPE } from '@/types/NodeType';

export * from './types';
export { TheoryOfMindNodeProperties, ReactFlowTheoryOfMindNode };

// Export the configuration object (do NOT call registerMapping here)
export const theoryOfMindNodeConfig = {
    elementType: NODE_TYPE.THEORY_OF_MIND,
    name: 'Theory Of Mind',
    icon: icon.src,
    isExercise: false,
    propertiesComponent: TheoryOfMindNodeProperties,
    elementComponent: ReactFlowTheoryOfMindNode,
    defaultData: {
        nodeData: {},
        quiz: [],
    },
};