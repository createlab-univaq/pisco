import { getSmartEdge } from '@tisoap/react-flow-smart-edge';
import { BezierEdge, EdgeLabelRenderer, useNodes } from 'reactflow';
import useStore from '../../../store';
import { ReactFlowEdgeProps } from '../ReactFlowEdge';

type ReactFlowSmartBezierEdgeProps = ReactFlowEdgeProps & {};

// wrapper around the default bezier edge with additional clickable area
const ReactFlowSmartBezierEdgePassFail = (
  props: ReactFlowSmartBezierEdgeProps
) => {
  const label = useStore((state) => state.edgeMap.get(props.id)?.title);

  const {
    id,
    sourcePosition,
    targetPosition,
    sourceX,
    sourceY,
    targetX,
    targetY,
    markerEnd,
    source,
    target,
  } = props;

  const { edgeMap } = useStore();

  const edge = edgeMap.get(id);

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

  // If the value returned is null, it means "getSmartEdge" was unable to find
  // a valid path, and you should do something else instead
  if (getSmartEdgeResponse === null) {
    return <BezierEdge {...props} />;
  }

  const { edgeCenterX, edgeCenterY, svgPathString } = getSmartEdgeResponse;

  /* prova per modificare markerEnd
  const passFailEdge = {
    id: id,
    source: source,
    target: target,    
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#FF0072',
    },
    label: label,
    style:{ stroke: condition == 'fail' ? 'red' : 'green' }
  };
  */

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
        style={{
          stroke: edge?.data?.conditionKind == 'fail' ? 'red' : 'green',
        }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            background: 'transparent',
            padding: 10,
            fontSize: 12,
            transform: `translate(${edgeCenterX - 15}px,${edgeCenterY - 15}px)`,
          }}
        >
          {label}
        </div>
      </EdgeLabelRenderer>
      ;
    </>
  );
};
export default ReactFlowSmartBezierEdgePassFail;
