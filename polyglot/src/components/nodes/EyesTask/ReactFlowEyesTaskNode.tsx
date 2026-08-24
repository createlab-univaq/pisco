'use client';

import { Handle, Position, NodeProps } from 'reactflow';
// Using standard alias for public assets
import icon from '@public/eyes_icon.png';
import styles from './ReactFlowEyesTaskNode.module.css';
import { EyesTaskNodeData } from './types'; // Import the type defined in your types.ts file

export type ReactFlowEyesTaskNodeProps = NodeProps<
    EyesTaskNodeData & { label?: string; title?: string }
>;

const ReactFlowEyesTaskNode = ({
    data,
    isConnectable,
}: ReactFlowEyesTaskNodeProps) => {
    // Read the label directly from React Flow's injected data instead of a global store
    const nodeLabel = data?.label || data?.title || 'Eyes Task';

    return (
        <div className={styles.nodeCard}>
            <img
                src={icon.src}
                alt="Eyes Task"
                className={styles.icon}
            />

            <span className={styles.label}>{nodeLabel}</span>

            {/* Target Handle (Incoming connections) */}
            <Handle
                type="target"
                position={Position.Left}
                className={styles.handle}
                isConnectable={isConnectable}
            />

            {/* Source Handle (Outgoing connections) */}
            <Handle
                type="source"
                position={Position.Right}
                className={styles.handle}
                isConnectable={isConnectable}
            />
        </div>
    );
};

export default ReactFlowEyesTaskNode;