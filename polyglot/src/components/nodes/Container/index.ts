// Replace these with the actual local components once you refactor them
import ContainerNodeProperties from './ContainerNodeProperties';
import icon from '@public/box_icon.png';
import ReactFlowContainerNode from './ReactFlowContainerNode';

export * from './types';
export { ContainerNodeProperties, ReactFlowContainerNode };

// Export the configuration object (do NOT call registerMapping here)
export const containerNodeConfig = {
    elementType: 'ContainerNode',
    name: 'Container',
    icon: icon.src,
    group: 'concept',
    propertiesComponent: ContainerNodeProperties,
    elementComponent: ReactFlowContainerNode,
    defaultData: {
        nodeData: {},
        sections: [],
    },
};