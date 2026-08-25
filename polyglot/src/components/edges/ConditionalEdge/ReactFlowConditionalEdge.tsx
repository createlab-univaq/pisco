'use client';

import { BaseEdge, EdgeLabelRenderer, EdgeProps, getBezierPath } from 'reactflow';
import styles from './ReactFlowConditionalEdge.module.css';
import { ConditionalEdgeData } from './types';

export default function ReactFlowConditionalEdge(props: EdgeProps<ConditionalEdgeData>) {
    const {
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition,
        markerEnd,
        style,
        data,
    } = props;

    // 1. Calculate the curved path and the exact center coordinates for the label
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX, sourceY, sourcePosition,
        targetX, targetY, targetPosition,
    });

    // 2. Read the operator and threshold from the synced data
    const operator = data?.operator || '>=';
    const threshold = data?.threshold ?? 0;
    const label = `${operator} ${threshold}`;

    return (
        <>
            <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />

            <EdgeLabelRenderer>
                <div
                    className={`${styles.labelContainer} nodrag nopan`}
                    style={{
                        // FIXED: Reverted back to the reliable left/top positioning!
                        left: labelX,
                        top: labelY,
                    }}
                >
                    {label}
                </div>
            </EdgeLabelRenderer>
        </>
    );
}