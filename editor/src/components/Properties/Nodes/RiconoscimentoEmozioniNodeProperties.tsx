import { Box, Divider, Text } from '@chakra-ui/react';
import useStore from '../../../store';
import RiconoscimentoEmozioniNodeEmbedded from '../../Embedded/RiconoscimentoEmozioniNodeEmbedded/RiconoscimentoEmozioniNodeEmbedded';
import NodeProperties from './NodeProperties';

const RiconoscimentoEmozioniNodeProperties = () => {
  // nodo selezionato
  const selectedElement = useStore((store: any) => {
    const v = store.getSelectedElement;
    return typeof v === 'function' ? v() : v;
  });

  const nodeId = selectedElement?._id as string | undefined;

  return (
    <>
      <NodeProperties
        platform={['WebApp']}
        activityDescription="Riconoscimento delle emozioni: osserva un'immagine e seleziona l'emozione corretta."
      />

      <Box px={2} pt={2}>
        <Text fontSize="sm" color="gray.600">
          Suggerimento: carica un’immagine e inserisci le emozioni come
          possibili risposte, poi seleziona quella corretta.
        </Text>
      </Box>

      <Divider my={3} />

      <RiconoscimentoEmozioniNodeEmbedded
        basePath="data"
        parentNodeId={nodeId}
      />
    </>
  );
};

export default RiconoscimentoEmozioniNodeProperties;
