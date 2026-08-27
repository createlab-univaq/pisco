'use client';

import { Handle, Position, NodeProps } from 'reactflow';
import icon from '@public/step_icon.png';
import styles from './ReactFlowFauxPasExerciseANode.module.css';
import { FauxPasExerciseANodeData } from './types';

export type ReactFlowFauxPasExerciseANodeProps = NodeProps<
    FauxPasExerciseANodeData & { label?: string; title?: string }
>;

const ReactFlowFauxPasExerciseANode = ({
    data,
    isConnectable,
}: ReactFlowFauxPasExerciseANodeProps) => {
    const nodeLabel = data?.title || data?.label || 'Faux Pas Exercise A';

    return (
        <div className={styles.nodeCard}>
            <img src={icon.src} alt="Faux Pas Exercise A" className={styles.icon} />
            <span className={styles.label}>{nodeLabel}</span>

            <Handle type="target" position={Position.Left} className={styles.handle} isConnectable={isConnectable} />
            <Handle type="source" position={Position.Right} className={styles.handle} isConnectable={isConnectable} />
        </div>
    );
};

export default ReactFlowFauxPasExerciseANode;