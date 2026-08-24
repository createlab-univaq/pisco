'use client';

import { Handle, Position, NodeProps } from 'reactflow';
// Using standard alias for public assets
import icon from '@public/emotion_icon.png';
import styles from './ReactFlowEmotionAttributionBNode.module.css';
import { EmotionAttributionBNodeData } from './types'; // Import the type we defined earlier

export type ReactFlowEmotionAttributionBNodeProps = NodeProps<
    EmotionAttributionBNodeData & { label?: string; title?: string }
>;

const ReactFlowEmotionAttributionBNode = ({
    data,
    isConnectable,
}: ReactFlowEmotionAttributionBNodeProps) => {
    // Read the label directly from React Flow's injected data instead of a global store
    const nodeLabel = data?.label || data?.title || 'Emotion Attribution B';

    return (
        <div className={styles.nodeCard}>
            <img
                src={icon.src}
                alt="Emotion Attribution B"
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

export default ReactFlowEmotionAttributionBNode;