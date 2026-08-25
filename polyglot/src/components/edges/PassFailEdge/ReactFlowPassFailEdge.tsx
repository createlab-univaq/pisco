'use client';

import { BaseEdge, EdgeLabelRenderer, EdgeProps, getBezierPath } from 'reactflow';
import styles from './ReactFlowPassFailEdge.module.css';
import { PassFailEdgeData } from './types';

export default function ReactFlowPassFailEdge(props: EdgeProps<PassFailEdgeData & { title?: string }>) {
    const { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, markerEnd, style, data } = props;

    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX, sourceY, sourcePosition,
        targetX, targetY, targetPosition,
    });

    const condition = data?.conditionKind || 'pass';
    const strokeColor = condition === 'fail' ? '#e53e3e' : '#38a169';

    return (
        <>
            <BaseEdge
                path={edgePath}
                markerEnd={markerEnd} // 2. Pass React Flow's native marker string here
                style={{ ...style, stroke: strokeColor, strokeWidth: 2 }}
            />

            <EdgeLabelRenderer>
                <div
                    className={styles.labelContainer}
                    style={{ left: labelX, top: labelY, color: strokeColor }}
                >
                    {condition.toUpperCase()} {data?.title ? `- ${data.title}` : ''}
                </div>
            </EdgeLabelRenderer>
        </>
    );
}