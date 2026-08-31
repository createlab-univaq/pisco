import icon from '@public/people_icon.png';
import SocialSituationsNodeProperties from './SocialSituationsNodeProperties';
import ReactFlowSocialSituationsNode from './ReactFlowSocialSituationsNode';
import { NODE_TYPE } from '@/types/NodeType';

export * from './types';
export { SocialSituationsNodeProperties, ReactFlowSocialSituationsNode };

export const socialSituationsNodeConfig = {
    elementType: NODE_TYPE.SOCIAL_SITUATIONS,
    name: 'Social Situations',
    icon: icon.src,
    group: 'remember_assessment',

    propertiesComponent: SocialSituationsNodeProperties,
    elementComponent: ReactFlowSocialSituationsNode,
    defaultData: {
        nodeData: {},
        items: [],
    },
};