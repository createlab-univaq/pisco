// Replace these with the actual local components once you refactor them
import icon from '@public/step_icon.png';
import FauxPasNodeProperties from './FauxPasNodeProperties';
import ReactFlowFauxPasNode from './ReactFlowFauxPasNode';

export * from './types';
export { FauxPasNodeProperties, ReactFlowFauxPasNode };

export const fauxPasNodeConfig = {
    elementType: 'FauxPasNode',
    name: 'Faux Pas',
    icon: icon.src,
    group: 'remember_assessment',
    platform: 'WebApp',
    propertiesComponent: FauxPasNodeProperties,
    elementComponent: ReactFlowFauxPasNode,
    defaultData: {
        nodeData: {},
        quiz: [],
    },
};