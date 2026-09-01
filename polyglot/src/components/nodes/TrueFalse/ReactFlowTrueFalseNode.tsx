'use client';

import { Handle, Position, NodeProps } from 'reactflow';
import icon from '@public/trueFalse_icon.png';
import styles from './ReactFlowTrueFalseNode.module.css';
import { TrueFalseNodeData } from './types';

export type ReactFlowTrueFalseNodeProps = NodeProps<TrueFalseNodeData & { label?: string; title?: string }>;

const ReactFlowTrueFalseNode = ({ data, isConnectable }: ReactFlowTrueFalseNodeProps) => {
    // Reads data.title first to reflect live edits from the properties panel
    const nodeLabel = data?.title || data?.label || 'True False';

    return (
        <div className={styles.nodeCard}>
            <img
                src={icon.src}
                alt="True/False Icon"
                className={styles.icon}
            />

            <span className={styles.label}>{nodeLabel}</span>

            <Handle
                type="target"
                position={Position.Left}
                className={styles.handle}
                isConnectable={isConnectable}
            />

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