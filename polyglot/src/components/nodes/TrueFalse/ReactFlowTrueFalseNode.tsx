'use client';

import { Handle, Position, NodeProps } from 'reactflow';
import icon from '@public/trueFalse_icon.png';
import styles from './ReactFlowTrueFalseNode.module.css';
import { TrueFalseNodeData } from './types';

// Extend the standard React Flow NodeProps with your data type[cite: 5].
export type ReactFlowTrueFalseNodeProps = NodeProps<TrueFalseNodeData & { label?: string; title?: string }>;

const ReactFlowTrueFalseNode = ({ data, isConnectable }: ReactFlowTrueFalseNodeProps) => {
    // Read the title/label directly from the React Flow data prop[cite: 5].
    const nodeLabel = data?.label || data?.title || 'True False';

    return (
        <div className={styles.nodeCard}>
            <img
                src={icon.src}
                alt="True/False Icon"
                className={styles.icon}
            />

            <span className={styles.label}>{nodeLabel}</span>

            {/* Target Handle (Incoming connections)[cite: 5] */}
            <Handle
                type="target"
                position={Position.Left}
                className={styles.handle}
                isConnectable={isConnectable}
            />

            {/* Source Handle (Outgoing connections)[cite: 5] */}
            <Handle
                type="source"
                position={Position.Right}
                className={styles.handle}
                isConnectable={isConnectable}
            />
        </div>
    );
};

export default ReactFlowTrueFalseNode;