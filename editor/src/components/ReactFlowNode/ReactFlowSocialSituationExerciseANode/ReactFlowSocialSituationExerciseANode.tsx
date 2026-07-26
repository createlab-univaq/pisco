import { Handle, Position } from 'reactflow';
import icon from '../../../public/icona_persone.png';
import useStore from '../../../store';
import { SocialSituationExerciseANode } from '../../../types/polyglotElements';
import Card from '../../Card/Card';
import { ReactFlowNodeProps } from '../ReactFlowNode';

type Props = ReactFlowNodeProps & SocialSituationExerciseANode;

const ReactFlowSocialSituationExerciseANode = ({ id }: Props) => {
  const [onConnect, label] = useStore((state) => [
    state.onConnect,
    state.nodeMap.get(id)?.title,
  ]);

  return (
    <Card className="Card-react-flow">
      <img
        src={icon.src}
        width="20"
        height="20"
        alt="Social situation exercise"
        style={{ float: 'left', marginTop: '2px', marginRight: '5px' }}
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

export default ReactFlowSocialSituationExerciseANode;
