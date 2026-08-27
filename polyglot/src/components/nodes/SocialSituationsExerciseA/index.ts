import { NODE_TYPE } from '@/types/polyglot-elements/NodeType';
import icon from '@public/people_icon.png';
import SocialSituationsExerciseANodeProperties from './SocialSituationsExerciseANodeProperties';
import ReactFlowSocialSituationsExerciseANode from './ReactFlowSocialSituationsExerciseANode';

export * from './types';
export { SocialSituationsExerciseANodeProperties, ReactFlowSocialSituationsExerciseANode };

export const socialSituationsExerciseANodeConfig = {
    elementType: NODE_TYPE.SOCIAL_SITUATIONS_EXERCISE_A,
    name: 'Situazione Sociale (A)',
    icon: icon.src,
    group: 'apply_assessment',

    propertiesComponent: SocialSituationsExerciseANodeProperties,
    elementComponent: ReactFlowSocialSituationsExerciseANode,
    defaultData: {
        nodeData: {},
        items: [],
    },
};