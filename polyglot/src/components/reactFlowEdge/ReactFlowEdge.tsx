import type { ReactNode } from 'react';
import type { EdgeProps } from 'reactflow';

/**
 * Base props for all custom React Flow edges in the application.
 * Using an interface allows you to easily extend this with custom Polyglot properties later.
 */
export interface ReactFlowEdgeProps extends EdgeProps {
    // Add any custom global edge properties here in the future
    // e.g., polyglotId?: string;
}

/**
 * Base React Flow Edge Component.
 * 
 * Note: If you only use this file to export the `ReactFlowEdgeProps` type for your registry, 
 * you can safely delete this component and just export the interface!
 */
const ReactFlowEdge = (props: ReactFlowEdgeProps): ReactNode => {
    return null;
};

export default ReactFlowEdge;