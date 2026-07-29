import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import { API } from '../../../data/api';
import useStore from '../../../store';
import QuestionImageUploadField from '../../Forms/Fields/QuestionImageUploadField';
import SingleSelectAnswersField from '../../Forms/Fields/SingleSelectAnswersField';
import NodeProperties from './NodeProperties';

const newId = (prefix: string) =>
  globalThis.crypto?.randomUUID?.() ??
  `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;

type EyesTaskQuestionForm = {
  qid?: string; // id logico della domanda
  imageId?: string; // id immagine (File._id)
  answers?: string[];
  correctIndex?: number;
};

const EyesTaskTestNodeProperties = () => {
  const { control } = useFormContext();
  const toast = useToast();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'data.questions',
  });

  const questions = useWatch({
    control,
    name: 'data.questions',
  }) as EyesTaskQuestionForm[] | undefined;

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
        activityDescription="Crea una lista di quesiti con un’immagine per ciascuno. Ogni quesito ha più risposte: seleziona quella corretta."
      />

      <Flex justify="space-between" align="center" mb={2}>
        <Heading size="sm">Quesiti</Heading>
        <Button
          size="sm"
          leftIcon={<AddIcon />}
          onClick={() =>
            append({
              qid: newId('q'),
              imageId: undefined,
              answers: ['', ''],
              correctIndex: 0,
            })
          }
        >
          Aggiungi quesito
        </Button>
      </Flex>

      {fields.length === 0 && (
        <Box borderWidth="1px" borderRadius="md" p={3} opacity={0.85}>
          <Text fontSize="sm">
            Nessun quesito ancora. Clicca <b>Aggiungi quesito</b> per iniziare.
          </Text>
        </Box>
      )}

      <Stack spacing={4}>
        {fields.map((field, index) => {
          const base = `data.questions.${index}`;
          const imageId = questions?.[index]?.imageId;

          return (
            <Box key={field.id} borderWidth="1px" borderRadius="md" p={3}>
              <Flex justify="space-between" align="center" mb={2}>
                <Heading size="xs">Quesito #{index + 1}</Heading>

                <IconButton
                  aria-label="Rimuovi quesito"
                  size="xs"
                  colorScheme="red"
                  icon={<CloseIcon />}
                  type="button"
                  onClick={async () => {
                    const imageIdToDelete = questions?.[index]?.imageId;

                    // Se c'è un'immagine, prova a cancellarla prima
                    if (imageIdToDelete) {
                      try {
                        await API.deleteByFileId({ fileId: imageIdToDelete });
                      } catch (e) {
                        console.error('Delete image failed', e);
                        toast({
                          title: 'Immagine non eliminata',
                          description:
                            'Non sono riuscito a eliminare l’immagine associata. Riprova o elimina più tardi.',
                          status: 'warning',
                          duration: 3500,
                          position: 'bottom-left',
                          isClosable: true,
                        });
                        // Non rimuovo il quesito per non perdere il riferimento
                        return;
                      }
                    }

                    // Delete ok (o nessuna immagine) → rimuovo il quesito
                    remove(index);
                  }}
                />
              </Flex>

              {nodeId ? (
                <QuestionImageUploadField
                  parentNodeId={nodeId}
                  imageId={imageId}
                  imageIdName={`${base}.imageId`}
                />
              ) : (
                <Text fontSize="xs" opacity={0.6} mt={2}>
                  Seleziona il nodo per caricare un’immagine.
                </Text>
              )}

              <SingleSelectAnswersField
                label="Risposte (seleziona quella corretta)"
                answersName={`${base}.answers`}
                correctIndexName={`${base}.correctIndex`}
                minAnswers={2}
                defaultAnswers={['', '']}
                allowNoCorrect={false}
              />
            </Box>
          );
        })}
      </Stack>
    </>
  );
};

export default EyesTaskTestNodeProperties;
