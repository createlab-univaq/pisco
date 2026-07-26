import { Box, Divider, Text } from '@chakra-ui/react';
import EmotionAttributionAEmbedded from '../../Embedded/EmotionAttributionANodeEmbedded/EmotionAttributionANodeEmbedded';
import NodeProperties from './NodeProperties';

const EmotionAttributionANodeProperties = () => {
  return (
    <>
      <NodeProperties
        platform={['WebApp']}
        activityDescription="Esercitazione di attribuzione delle emozioni (Tipo A): inserisci uno scenario, una domanda e le risposte corrette con le relative spiegazioni."
      />

      <Box px={2} pt={2}>
        <Text fontSize="sm" color="gray.600">
          Suggerimento: usa <b>Scenario</b> per descrivere la situazione e{' '}
          <b>Domanda</b> per chiedere quale emozione/interpretazione è corretta.
          Inserisci poi una o più <b>risposte corrette</b>.
        </Text>
      </Box>

      <Divider my={3} />

      {/* Qui dici solo dove stanno i campi per QUESTO nodo */}
      <EmotionAttributionAEmbedded basePath="data" />
    </>
  );
};

export default EmotionAttributionANodeProperties;
