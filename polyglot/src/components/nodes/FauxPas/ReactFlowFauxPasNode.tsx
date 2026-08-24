'use client';

import { Handle, Position, NodeProps } from 'reactflow';
// Using standard alias for public assets
import icon from '@public/icona_passo.png';
import styles from './ReactFlowFauxPasNode.module.css';
import { FauxPasNodeData } from './types'; // Import the type defined in your types.ts file

export type ReactFlowFauxPasNodeProps = NodeProps<
    FauxPasNodeData & { label?: string; title?: string }
>;

const ReactFlowFauxPasNode = ({
    data,
    isConnectable,
}: ReactFlowFauxPasNodeProps) => {
    // Read the label directly from React Flow's injected data instead of a global store
    const nodeLabel = data?.label || data?.title || 'Faux Pas';

    return (
        <div className={styles.nodeCard}>
            <img
                src={icon.src}
                alt="Faux Pas"
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

export default ReactFlowFauxPasNode;