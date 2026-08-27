'use client';

import { Handle, Position, NodeProps } from 'reactflow';
import icon from '@public/brain_icon.png';
import styles from './ReactFlowTheoryOfMindExerciseANode.module.css';
import { TheoryOfMindExerciseANodeData } from './types';

export type ReactFlowTheoryOfMindExerciseANodeProps = NodeProps<
    TheoryOfMindExerciseANodeData & { label?: string; title?: string }
>;

const ReactFlowTheoryOfMindExerciseANode = ({
    data,
    isConnectable,
}: ReactFlowTheoryOfMindExerciseANodeProps) => {
    const nodeLabel = data?.title || data?.label || 'Teoria Della Mente (A)';

    return (
        <div className={styles.nodeCard}>
            <img
                src={icon.src}
                alt="Teoria della mente Exercise A"
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

export default ReactFlowTheoryOfMindExerciseANode;