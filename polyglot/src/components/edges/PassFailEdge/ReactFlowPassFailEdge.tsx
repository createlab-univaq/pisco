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

    // Read the synced condition (default to 'pass')
    const condition = data?.conditionKind || 'pass';

    // Reproduce the old styling logic: red for fail, green for pass
    const strokeColor = condition === 'fail' ? '#e53e3e' : '#38a169';

    return (
        <>
            <BaseEdge
                path={edgePath}
                markerEnd={markerEnd}
                style={{ ...style, stroke: strokeColor, strokeWidth: 2 }}
            />

            <EdgeLabelRenderer>
                <div
                    className={styles.labelContainer}
                    style={{ left: labelX, top: labelY, color: strokeColor }}
                >
                    {/* Shows PASS or FAIL in uppercase, and append the title if it exists */}
                    {condition.toUpperCase()} {data?.title ? `- ${data.title}` : ''}
                </div>
            </EdgeLabelRenderer>
        </>
    );
}