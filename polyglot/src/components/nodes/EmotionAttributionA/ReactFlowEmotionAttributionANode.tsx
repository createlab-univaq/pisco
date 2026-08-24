'use client';

import { Handle, Position, NodeProps } from 'reactflow';
// Use Next.js standard absolute import for public assets if configured, or relative.
import icon from '@public/emotion_icon.png';
import styles from './ReactFlowEmotionAttributionANode.module.css';

// NOTE: Import your specific node data type from your types.ts file once created.
// import { EmotionAttributionANodeData } from './types';
type EmotionAttributionANodeData = any;

export type ReactFlowEmotionAttributionANodeProps = NodeProps<
    EmotionAttributionANodeData & { label?: string; title?: string }
>;

const ReactFlowEmotionAttributionANode = ({
    data,
    isConnectable,
}: ReactFlowEmotionAttributionANodeProps) => {
    // Read the label directly from React Flow's injected data instead of a global store
    const nodeLabel = data?.label || data?.title || 'Emotion Attribution A';

    return (
        <div className={styles.nodeCard}>
            <img
                src={icon.src}
                alt="Emotion Attribution A"
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

export default ReactFlowEmotionAttributionANode;