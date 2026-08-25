'use client';

import { BaseEdge, EdgeLabelRenderer, EdgeProps, getBezierPath } from 'reactflow';
import styles from './ReactFlowUnconditionalEdge.module.css';
import { UnconditionalEdgeData } from './types';

export default function ReactFlowUnconditionalEdge(props: EdgeProps<UnconditionalEdgeData & { title?: string }>) {
    const { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, markerEnd, style, data } = props;

    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX, sourceY, sourcePosition,
        targetX, targetY, targetPosition,
    });

    return (
        <>
            <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />

            {/* Only render the label if a title actually exists */}
            {data?.title && (
                <EdgeLabelRenderer>
                    <div className={styles.labelContainer} style={{ left: labelX, top: labelY }}>
                        {data.title}
                    </div>
                </EdgeLabelRenderer>
            )}
        </>
    );
}