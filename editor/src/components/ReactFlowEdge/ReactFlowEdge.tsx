import { EdgeProps } from 'reactflow';

export type ReactFlowEdgeProps = EdgeProps & {};

declare const ReactFlowEdge: (props: ReactFlowEdgeProps) => JSX.Element;

export default ReactFlowEdge;
