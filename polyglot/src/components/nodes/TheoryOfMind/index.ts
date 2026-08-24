// Replace these with the actual local components once you refactor them
import icon from '@public/brain_icon.png';
import TheoryOfMindNodeProperties from './TheoryOfMindNodeProperties';
import ReactFlowTheoryOfMindNode from './ReactFlowTheoryOfMindNode';

export * from './types';
export { TheoryOfMindNodeProperties, ReactFlowTheoryOfMindNode };

// Export the configuration object (do NOT call registerMapping here)
export const theoryOfMindNodeConfig = {
    elementType: 'TheoryOfMindNode',
    name: 'Teoria Della Mente',
    icon: icon.src,
    group: 'remember_assessment',
    platform: 'WebApp',
    propertiesComponent: TheoryOfMindNodeProperties,
    elementComponent: ReactFlowTheoryOfMindNode,
    defaultData: {
        nodeData: {},
        quiz: [],
    },
};