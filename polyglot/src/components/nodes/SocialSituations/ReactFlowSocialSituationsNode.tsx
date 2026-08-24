'use client';

import { Handle, Position, NodeProps } from 'reactflow';
// Using standard alias for public assets
import icon from '@public/icona_persone.png';
import styles from './ReactFlowSocialSituationsNode.module.css';
import { SocialSituationsNodeData } from './types'; // Import the type defined in your types.ts file

export type ReactFlowSocialSituationsNodeProps = NodeProps<
    SocialSituationsNodeData & { label?: string; title?: string }
>;

const ReactFlowSocialSituationsNode = ({
    data,
    isConnectable,
}: ReactFlowSocialSituationsNodeProps) => {
    // Read the label directly from React Flow's injected data instead of a global store
    const nodeLabel = data?.label || data?.title || 'Situazioni sociali';

    return (
        <div className={styles.nodeCard}>
            <img
                src={icon.src}
                alt="Social situations"
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

export default ReactFlowSocialSituationsNode;