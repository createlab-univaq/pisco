import { Handle, Position } from 'reactflow';
import icon from '../../../public/icona_persone.png';
import useStore from '../../../store';
import { SocialSituationsNode } from '../../../types/polyglotElements';
import Card from '../../Card/Card';
import { ReactFlowNodeProps } from '../ReactFlowNode';

type Props = ReactFlowNodeProps & SocialSituationsNode;

const ReactFlowSocialSituationsNode = ({ id }: Props) => {
  // Recupero:
  // - onConnect: funzione globale per collegare i nodi
  // - label: titolo del nodo salvato nello store
  const [onConnect, label] = useStore((state) => [
    state.onConnect,
    state.nodeMap.get(id)?.title,
  ]);

  return (
    <Card className="Card-react-flow">
      {/* Icona del nodo */}
      <img
        src={icon.src}
        width="20"
        height="20"
        alt="Social situations"
        style={{ float: 'left', marginTop: '2px', marginRight: '5px' }}
      />

      {/* Titolo del nodo */}
      {label}

      {/* Handle di uscita: da questo nodo parte la connessione */}
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

      {/* Handle di ingresso: connessione dal nodo precedente */}
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

export default ReactFlowSocialSituationsNode;
