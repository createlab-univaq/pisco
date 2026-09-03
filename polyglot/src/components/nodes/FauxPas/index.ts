// Replace these with the actual local components once you refactor them
import icon from '@public/step_icon.png';
import FauxPasNodeProperties from './FauxPasNodeProperties';
import ReactFlowFauxPasNode from './ReactFlowFauxPasNode';
import { NODE_TYPE } from '@/types/NodeType';

export * from './types';
export { FauxPasNodeProperties, ReactFlowFauxPasNode };

export const fauxPasNodeConfig = {
    elementType: NODE_TYPE.FAUX_PAS,
    name: 'Faux Pas',
    icon: icon.src,
    isExercise: false,
    propertiesComponent: FauxPasNodeProperties,
    elementComponent: ReactFlowFauxPasNode,
    defaultData: {
        nodeData: {},
        quiz: [],
    },
};