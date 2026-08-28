import { NODE_TYPE } from '@/types/NodeType';
import icon from '@public/brain_icon.png';
import TheoryOfMindExerciseANodeProperties from './TheoryOfMindExerciseANodeProperties';
import ReactFlowTheoryOfMindExerciseANode from './ReactFlowTheoryOfMindExerciseANode';

export * from './types';
export { TheoryOfMindExerciseANodeProperties, ReactFlowTheoryOfMindExerciseANode };

export const theoryOfMindExerciseANodeConfig = {
    elementType: NODE_TYPE.THEORY_OF_MIND_EXERCISE_A,
    name: 'Teoria Della Mente (A)',
    icon: icon.src,
    group: 'apply_assessment',

    propertiesComponent: TheoryOfMindExerciseANodeProperties,
    elementComponent: ReactFlowTheoryOfMindExerciseANode,
    defaultData: {
        nodeData: {},
        quiz: [],
    },
};