'use client';

import { Handle, Position, NodeProps } from 'reactflow';
import icon from '@public/eyes_icon.png';
import styles from './ReactFlowEmotionRecognitionExerciseANode.module.css';
import Card from '@/components/cards/Card';

type EmotionRecognitionExerciseANodeData = {
    title?: string;
    description?: string;
    [key: string]: any;
};

const ReactFlowEmotionRecognitionExerciseANode = ({ data }: NodeProps<EmotionRecognitionExerciseANodeData>) => {
    const title = data?.title || data?.label || 'Riconoscimento emozioni';

    return (
        <Card className={styles.nodeCard}>
            <img
                src={icon.src}
                width="20"
                height="20"
                alt="Emotion recognition"
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

export default ReactFlowEmotionRecognitionExerciseANode;