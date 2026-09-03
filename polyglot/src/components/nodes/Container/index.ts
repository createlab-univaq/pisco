// Replace these with the actual local components once you refactor them
import ContainerNodeProperties from './ContainerNodeProperties';
import icon from '@public/box_icon.png';
import ReactFlowContainerNode from './ReactFlowContainerNode';
import { NODE_TYPE } from '@/types/NodeType';

export * from './types';
export { ContainerNodeProperties, ReactFlowContainerNode };

// Export the configuration object (do NOT call registerMapping here)
export const containerNodeConfig = {
    elementType: NODE_TYPE.CONTAINER,
    name: 'Container',
    icon: icon.src,
    isExercise: true,
    propertiesComponent: ContainerNodeProperties,
    elementComponent: ReactFlowContainerNode,
    defaultData: {
        nodeData: {},
        sections: [],
    },
};