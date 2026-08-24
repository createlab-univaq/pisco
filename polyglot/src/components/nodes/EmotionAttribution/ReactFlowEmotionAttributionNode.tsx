'use client';

import { Handle, Position, NodeProps } from 'reactflow';
// Using standard alias for public assets
import icon from '@public/emotion_icon.png';
import styles from './ReactFlowEmotionAttributionNode.module.css';
import { EmotionAttributionNodeData } from './types'; // Import the type we defined for the  node

export type ReactFlowEmotionAttributionNodeProps = NodeProps<
    EmotionAttributionNodeData & { label?: string; title?: string }
>;

const ReactFlowEmotionAttributionNode = ({
    data,
    isConnectable,
}: ReactFlowEmotionAttributionNodeProps) => {
    // Read the label directly from React Flow's injected data instead of a global store
    const nodeLabel = data?.label || data?.title || 'Attribuzione delle Emozioni';

    return (
        <div className={styles.nodeCard}>
            <img
                src={icon.src}
                alt="Attribuzione delle Emozioni"
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

export default ReactFlowEmotionAttributionNode;