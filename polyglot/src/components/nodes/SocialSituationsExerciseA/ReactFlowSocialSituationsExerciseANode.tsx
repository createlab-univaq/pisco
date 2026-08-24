'use client';

import { Handle, Position, NodeProps } from 'reactflow';
import styles from './ReactFlowSocialSituationsExerciseANode.module.css';
import Card from '@/components/cards/Card';
import icon from '@public/person_icon.png';

type SocialSituationNodeData = {
    title?: string;
    description?: string;
    [key: string]: any;
};

const ReactFlowSocialSituationsExerciseANode = ({ data }: NodeProps<SocialSituationNodeData>) => {
    const title = data?.title || 'Situazione Sociale';

    return (
        <Card className={styles.card}>
            <img
                src={icon.src}
                width="20"
                height="20"
                alt="Social situation exercise"
                className={styles.icon}
            />
            <span className={styles.label}>{title}</span>

            <Handle
                type="target"
                position={Position.Left}
                className={styles.handle}
            />
            <Handle
                type="source"
                position={Position.Right}
                className={styles.handle}
            />
        </Card>
    );
};

export default ReactFlowSocialSituationsExerciseANode;