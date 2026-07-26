import { NodeProps } from 'reactflow';

export type ReactFlowNodeProps = NodeProps & {};

declare const ReactFlowNode: (props: ReactFlowNodeProps) => JSX.Element;

export default ReactFlowNode;
