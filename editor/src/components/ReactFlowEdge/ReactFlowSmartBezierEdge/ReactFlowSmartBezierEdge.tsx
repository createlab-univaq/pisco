import { getSmartEdge } from '@tisoap/react-flow-smart-edge';
import { BezierEdge, EdgeLabelRenderer, useNodes } from 'reactflow';
import useStore from '../../../store';
import { ReactFlowEdgeProps } from '../ReactFlowEdge';

type ReactFlowSmartBezierEdgeProps = ReactFlowEdgeProps & {};

const ReactFlowSmartBezierEdge = (props: ReactFlowSmartBezierEdgeProps) => {
  const label = useStore((state) => state.edgeMap.get(props.id)?.title);
  const {
    sourcePosition,
    targetPosition,
    sourceX,
    sourceY,
    targetX,
    targetY,
    markerEnd,
  } = props;

  const nodes = useNodes();

  const getSmartEdgeResponse = getSmartEdge({
    sourcePosition,
    targetPosition,
    sourceX,
    sourceY,
    targetX,
    targetY,
    nodes,
  });

  if (getSmartEdgeResponse === null) {
    return <BezierEdge {...props} />;
  }

  const { edgeCenterX, edgeCenterY, svgPathString } = getSmartEdgeResponse;

  const strokeColor =
    (props.style as any)?.stroke || (markerEnd as any)?.color || 'black';

  return (
    <>
      <path
        className="react-flow__edge-path"
        d={svgPathString}
        style={{
          stroke: 'transparent',
          strokeWidth: '4',
        }}
      />
      <path
        className="react-flow__edge-path"
        d={svgPathString}
        markerEnd={markerEnd}
        style={{ stroke: strokeColor }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            background: 'transparent',
            strokeWidth: '100',
            padding: 10,
            fontSize: 12,
            transform: `translate(${edgeCenterX - 15}px,${edgeCenterY - 15}px)`,
          }}
        >
          {label}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};
export default ReactFlowSmartBezierEdge;
