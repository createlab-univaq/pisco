import { Handle, Position } from 'reactflow';
import icon from '../../../public/icona_occhi.png';
import useStore from '../../../store';
import { EyesTaskTestNode } from '../../../types/polyglotElements';
import Card from '../../Card/Card';
import { ReactFlowNodeProps } from '../ReactFlowNode';

type Props = ReactFlowNodeProps & EyesTaskTestNode;

const ReactFlowEyesTaskTest = ({ id }: Props) => {
  const [onConnect, title] = useStore((state: any) => [
    state.onConnect,
    state.nodeMap.get(id)?.title,
  ]);

  return (
    <Card className="Card-react-flow">
      <img
        src={icon.src}
        width="20"
        height="20"
        style={{ float: 'left', marginRight: '5px' }}
        alt="Eyes Task"
      />

      {/* Titolo del nodo nel canvas */}
      {title}

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

export default ReactFlowEyesTaskTest;
