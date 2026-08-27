import icon from '@public/step_icon.png';
import FauxPasExerciseANodeProperties from './FauxPasExerciseANodeProperties';
import ReactFlowFauxPasExerciseANode from './ReactFlowFauxPasExerciseANode';

export * from './types';
export { FauxPasExerciseANodeProperties, ReactFlowFauxPasExerciseANode };

export const fauxPasExerciseANodeConfig = {
    elementType: 'FauxPasExerciseANode',
    name: 'Faux Pas Exercise A',
    icon: icon.src,
    group: 'remember_assessment',

    propertiesComponent: FauxPasExerciseANodeProperties,
    elementComponent: ReactFlowFauxPasExerciseANode,
    defaultData: {
        nodeData: {},
        quiz: [],
    },
};