import { NODE_TYPE } from '@/types/polyglot-elements/NodeType';
import icon from '@public/person_icon.png';
import SocialSituationsExerciseANodeProperties from './SocialSituationsExerciseANodeProperties';
import ReactFlowSocialSituationsExerciseANode from './ReactFlowSocialSituationsExerciseANode';

export * from './types';
export { SocialSituationsExerciseANodeProperties, ReactFlowSocialSituationsExerciseANode };

export const SocialSituationsExerciseANodeConfig = {
    elementType: NODE_TYPE.SOCIAL_SITUATIONS_EXERCISE_A,
    name: 'Situazione Sociale (A)',
    icon: icon.src,
    group: 'apply_assessment',
    platform: 'WebApp',
    propertiesComponent: SocialSituationsExerciseANodeProperties,
    elementComponent: ReactFlowSocialSituationsExerciseANode,
    defaultData: {
        nodeData: {},
        scenario: '',
        items: [],
        correctIndex: 0,
    },
};