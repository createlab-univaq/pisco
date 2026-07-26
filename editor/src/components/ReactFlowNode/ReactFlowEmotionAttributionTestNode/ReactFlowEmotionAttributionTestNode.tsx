import { Handle, Position } from 'reactflow';
import icon from '../../../public/icona_emozioni.png';
import useStore from '../../../store';
import { EmotionAttributionTestNode } from '../../../types/polyglotElements';
import Card from '../../Card/Card';
import { ReactFlowNodeProps } from '../ReactFlowNode';

type Props = ReactFlowNodeProps & EmotionAttributionTestNode;

// Stile condiviso per evitare duplicazioni tra source/target
const handleStyle = {
  background: '#3B1D5C',
  height: '25px',
  width: '5px',
  borderRadius: '0px',
  border: '0px',
};

const ReactFlowEmotionAttributionTestNode = ({ id }: Props) => {
  // Prendo:
  // - onConnect: handler globale per collegare i nodi
  // - title: titolo del nodo salvato nello store (nodeMap)
  const [onConnect, title] = useStore((state) => [
    state.onConnect,
    state.nodeMap.get(id)?.title,
  ]);

  return (
    <Card className="Card-react-flow">
      {/* Icona del nodo (piccola) */}
      <img
        src={icon.src}
        width="20"
        height="20"
        alt="Attribuzione delle emozioni"
        style={{ float: 'left', marginRight: '5px' }}
      />

      {/* Titolo del nodo nel canvas */}
      {title}

      {/* Uscita (source): da qui partono le connessioni verso il nodo successivo */}
      <Handle
        type="source"
        position={Position.Right}
        style={handleStyle}
        onConnect={onConnect}
      />

      {/* Entrata (target): qui arrivano le connessioni dal nodo precedente */}
      <Handle type="target" position={Position.Left} style={handleStyle} />
    </Card>
  );
};

export default ReactFlowEmotionAttributionTestNode;
