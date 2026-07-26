import { Box, Divider, Text } from '@chakra-ui/react';
import { useWatch } from 'react-hook-form';

import useStore from '../../../store';
import QuestionImageUploadField from '../../Forms/Fields/QuestionImageUploadField';
import SingleSelectAnswersField from '../../Forms/Fields/SingleSelectAnswersField';

export type EmbeddedProps = {
  basePath: string; // es: "data" oppure "data.sections.0.items.0.data"
  parentNodeId?: string; // opzionale (se lo passi dal container è meglio)
  parentItemId?: string; // opzionale (solo per item del container)
  isDisabled?: boolean;
};

const RiconoscimentoEmozioniNodeEmbedded = ({
  basePath,
  parentNodeId,
  parentItemId,
  isDisabled,
}: EmbeddedProps) => {
  // fallback: se non mi passano parentNodeId, uso quello selezionato (nodo normale)
  const selectedNodeId = useStore((s) => s.selectedNode) ?? '';
  const effectiveParentNodeId = parentNodeId ?? selectedNodeId;

  const imageId = useWatch({ name: `${basePath}.imageId` }) as
    | string
    | undefined;

  return (
    <Box>
      <Text fontWeight="bold" mb={2}>
        Riconoscimento emozioni
      </Text>

      <QuestionImageUploadField
        parentNodeId={effectiveParentNodeId}
        parentItemId={parentItemId} // nuovo
        imageId={imageId}
        imageIdName={`${basePath}.imageId`}
        isDisabled={!!isDisabled || !effectiveParentNodeId}
      />

      <Divider my={3} />

      <SingleSelectAnswersField
        label="Seleziona la risposta corretta"
        answersName={`${basePath}.answers`}
        correctIndexName={`${basePath}.correctIndex`}
        minAnswers={2}
        defaultAnswers={['', '']}
        allowNoCorrect={false}
      />
    </Box>
  );
};

export default RiconoscimentoEmozioniNodeEmbedded;
