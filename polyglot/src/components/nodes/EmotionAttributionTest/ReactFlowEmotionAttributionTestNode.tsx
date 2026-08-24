'use client';

import { Handle, Position, NodeProps } from 'reactflow';
// Using standard alias for public assets
import icon from '@public/icona_emozioni.png';
import styles from './ReactFlowEmotionAttributionTestNode.module.css';
import { EmotionAttributionTestNodeData } from './types'; // Import the type we defined for the Test node

export type ReactFlowEmotionAttributionTestNodeProps = NodeProps<
    EmotionAttributionTestNodeData & { label?: string; title?: string }
>;

const ReactFlowEmotionAttributionTestNode = ({
    data,
    isConnectable,
}: ReactFlowEmotionAttributionTestNodeProps) => {
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

export default ReactFlowEmotionAttributionTestNode;