'use client';

import { Handle, Position, NodeProps } from 'reactflow';
import icon from '@public/box_icon.png';
import styles from './ReactFlowContainerNode.module.css';
import Card from '@/components/cards/Card';

type ContainerNodeData = {
    title?: string;
    description?: string;
    [key: string]: any;
};

const ReactFlowContainerNode = ({ data }: NodeProps<ContainerNodeData>) => {
    const title = data?.title || data?.label || 'Container Node';

    return (
        <Card className={styles.card}>
            <img src={icon.src} width="20" height="20" alt="Container" className={styles.icon} />
            <span className={styles.label}>{title}</span>
            <Handle type="target" position={Position.Left} className={styles.handle} />
            <Handle type="source" position={Position.Right} className={styles.handle} />
        </Card>
    );
};

export default ReactFlowContainerNode;