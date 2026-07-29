import { useTheme } from '@fluentui/react';
import { Handle, Position } from 'reactflow';
import icon from '../../../public/simulation_icon.png';
import useStore from '../../../store';
import { OpenQuestionNode } from '../../../types/polyglotElements';
import Card from '../../Card/Card';
import { ReactFlowNodeProps } from '../ReactFlowNode';

type ReactFlowOpenQuestionNodeProps = ReactFlowNodeProps & OpenQuestionNode;

const ReactFlowOpenQuestionNode = ({ id }: ReactFlowOpenQuestionNodeProps) => {
  const [onConnect, label] = useStore((state) => [
    state.onConnect,
    state.nodeMap.get(id)?.title,
  ]);
  const theme = useTheme();

  return (
    <Card className="Card-react-flow">
      <img
        src={icon.src}
        width="20"
        height="20"
        style={{ float: 'left', marginRight: '5px' }}
      />

      {label}
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: '#3B1D5C',
          height: '25px',
          width: '5px',
          borderRadius: '0px',
          border: '0px',
        }}
        onConnect={onConnect}
      />
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: '#3B1D5C',
          height: '25px',
          width: '5px',
          borderRadius: '0px',
          border: '0px',
        }}
      />
    </Card>
  );
};

export default ReactFlowOpenQuestionNode;
