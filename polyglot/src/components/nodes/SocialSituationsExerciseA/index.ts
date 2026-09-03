import { NODE_TYPE } from '@/types/NodeType';
import icon from '@public/people_icon.png';
import SocialSituationsExerciseANodeProperties from './SocialSituationsExerciseANodeProperties';
import ReactFlowSocialSituationsExerciseANode from './ReactFlowSocialSituationsExerciseANode';

export * from './types';
export { SocialSituationsExerciseANodeProperties, ReactFlowSocialSituationsExerciseANode };

export const socialSituationsExerciseANodeConfig = {
    elementType: NODE_TYPE.SOCIAL_SITUATIONS_EXERCISE_A,
    name: 'Social Situations Exercise (A)',
    icon: icon.src,
    isExercise: true,
    propertiesComponent: SocialSituationsExerciseANodeProperties,
    elementComponent: ReactFlowSocialSituationsExerciseANode,
    defaultData: {
        nodeData: {},
        items: [],
    },
};