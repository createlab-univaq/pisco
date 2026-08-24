import icon from '@public/people_icon.png';
import SocialSituationsNodeProperties from './SocialSituationsNodeProperties';
import ReactFlowSocialSituationsNode from './ReactFlowSocialSituationsNode';

export * from './types';
export { SocialSituationsNodeProperties, ReactFlowSocialSituationsNode };

export const socialSituationsNodeConfig = {
    elementType: 'SocialSituationsNode',
    name: 'Situazioni sociali',
    icon: icon.src,
    group: 'remember_assessment',
    platform: 'WebApp',
    propertiesComponent: SocialSituationsNodeProperties,
    elementComponent: ReactFlowSocialSituationsNode,
    defaultData: {
        nodeData: {},
        items: [],
    },
};