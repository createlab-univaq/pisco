'use client';

import { Handle, Position, NodeProps } from 'reactflow';
// Using standard alias for public assets
import icon from '@public/emotion_icon.png';
import styles from './ReactFlowEmotionAttributionNode.module.css';
import { EmotionAttributionNodeData } from './types'; // Import the type we defined for the  node

export type ReactFlowEmotionAttributionNodeProps = NodeProps<
    EmotionAttributionNodeData & { label?: string; title?: string }
>;

const ReactFlowEmotionAttributionNode = ({ data, isConnectable }: ReactFlowEmotionAttributionNodeProps) => {
    const nodeLabel = data?.title || data?.label || 'Attribuzione delle Emozioni';

    return (
        <div className={styles.nodeCard}>
            <img src={icon.src} alt="Attribuzione delle Emozioni" className={styles.icon} />
            <span className={styles.label}>{nodeLabel}</span>
            <Handle type="target" position={Position.Left} className={styles.handle} isConnectable={isConnectable} />
            <Handle type="source" position={Position.Right} className={styles.handle} isConnectable={isConnectable} />
        </div>
    );
};

export default ReactFlowEmotionAttributionNode;