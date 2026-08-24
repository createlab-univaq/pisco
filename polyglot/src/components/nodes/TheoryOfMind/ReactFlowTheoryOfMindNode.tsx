'use client';

import { Handle, Position, NodeProps } from 'reactflow';
// Using standard alias for public assets
import icon from '@public/brain_icon.png';
import styles from './ReactFlowTheoryOfMindNode.module.css';
import { TheoryOfMindNodeData } from './types';

export type ReactFlowTheoryOfMindNodeProps = NodeProps<
  TheoryOfMindNodeData & { label?: string; title?: string }
>;

const ReactFlowTheoryOfMindNode = ({
  data,
  isConnectable,
}: ReactFlowTheoryOfMindNodeProps) => {
  // Read the label directly from React Flow's injected data instead of a global store
  const nodeLabel = data?.label || data?.title || 'Teoria Della Mente';

  return (
    <div className={styles.nodeCard}>
      <img
        src={icon.src}
        alt="Teoria della mente"
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

export default ReactFlowTheoryOfMindNode;