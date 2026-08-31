import icon from '@public/step_icon.png';
import FauxPasExerciseANodeProperties from './FauxPasExerciseANodeProperties';
import ReactFlowFauxPasExerciseANode from './ReactFlowFauxPasExerciseANode';
import { NODE_TYPE } from '@/types/NodeType';

export * from './types';
export { FauxPasExerciseANodeProperties, ReactFlowFauxPasExerciseANode };

export const fauxPasExerciseANodeConfig = {
    elementType: NODE_TYPE.FAUX_PAS_EXERCISE_A,
    name: 'Faux Pas Exercise (A)',
    icon: icon.src,
    group: 'remember_assessment',

    propertiesComponent: FauxPasExerciseANodeProperties,
    elementComponent: ReactFlowFauxPasExerciseANode,
    defaultData: {
        nodeData: {},
        quiz: [],
    },
};