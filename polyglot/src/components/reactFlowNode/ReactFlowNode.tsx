import type { ReactNode } from 'react';
import type { NodeProps } from 'reactflow';

/**
 * Base props for all custom React Flow nodes in the application.
 * Using an interface allows you to easily extend this with custom Polyglot properties later.
 */
export interface ReactFlowNodeProps extends NodeProps {
    // Add any custom global node properties here in the future
    // e.g., polyglotId?: string;
}

/**
 * Base React Flow Node Component.
 * 
 * Note: If you only use this file to export the `ReactFlowNodeProps` type for your registry, 
 * you can safely delete this component and just export the interface!
 */
const ReactFlowNode = (props: ReactFlowNodeProps): ReactNode => {
    return null;
};

export default ReactFlowNode;