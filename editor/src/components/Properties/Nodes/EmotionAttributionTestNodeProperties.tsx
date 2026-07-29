import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  IconButton,
  Text,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import StringArrayField from '../../Forms/Fields/StringArrayField';
import TextField from '../../Forms/Fields/TextField';
import NodeProperties from './NodeProperties';

// Genera un id (preferibilmente UUID se disponibile)
const newId = (prefix: string) =>
  globalThis.crypto?.randomUUID?.() ??
  `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;

const EmotionAttributionTestNodeProperties = () => {
  const { control, getValues, setValue } = useFormContext();

  /**
   * Migrazione retro-compat (legacy):
   * - data.tests[0] -> data.minCorrectToPass + data.questions
   * - legacy correctAnswer -> correctAnswers[]
   */
  useEffect(() => {
    const questions = getValues('data.questions');
    const tests = getValues('data.tests');

    // Caso legacy: non ho questions, ma ho tests -> migro
    if (
      (!questions || !Array.isArray(questions)) &&
      Array.isArray(tests) &&
      tests.length > 0
    ) {
      const first = tests[0];

      setValue(
        'data.minCorrectToPass',
        typeof first?.minCorrectToPass === 'number'
          ? first.minCorrectToPass
          : 0,
        { shouldValidate: true }
      );

      const migrated = (first?.questions ?? []).map((q: any) => ({
        qid: q.qid ?? newId('q'),
        narration: q.narration ?? '',
        question: q.question ?? '',
        correctAnswers: Array.isArray(q.correctAnswers)
          ? q.correctAnswers
          : [q.correctAnswer ?? ''],
      }));

      setValue(
        'data.questions',
        migrated.length
          ? migrated
          : [
              {
                qid: newId('q'),
                narration: '',
                question: '',
                correctAnswers: [''],
              },
            ],
        { shouldValidate: true }
      );

      // Rimuovo il legacy container (qui lo "svuoto")
      setValue('data.tests', undefined);
    }

    // Normalizzo eventuale legacy correctAnswer dentro questions
    const qs = getValues('data.questions');
    if (Array.isArray(qs)) {
      const normalized = qs.map((q: any) => ({
        qid: q.qid ?? newId('q'),
        narration: q.narration ?? '',
        question: q.question ?? '',
        correctAnswers: Array.isArray(q.correctAnswers)
          ? q.correctAnswers
          : [q.correctAnswer ?? ''],
      }));

      // shouldDirty: false -> evita di sporcare il form se sto solo normalizzando
      setValue('data.questions', normalized, {
        shouldDirty: false,
        shouldValidate: true,
      });
    }

    // Default minCorrectToPass se mancante
    if (getValues('data.minCorrectToPass') == null) {
      setValue('data.minCorrectToPass', 0, { shouldValidate: true });
    }

    // Default questions se mancante
    if (!getValues('data.questions')) {
      setValue(
        'data.questions',
        [
          {
            qid: newId('q'),
            narration: '',
            question: '',
            correctAnswers: [''],
          },
        ],
        { shouldValidate: true }
      );
    }
  }, [getValues, setValue]);

  // Gestione dell'array di quesiti (questions)
  const questionsArray = useFieldArray({
    control,
    name: 'data.questions',
  });

  return (
    <>
      <NodeProperties platform={['WebApp']} />

      <Divider my={4} />

      <Flex justify="space-between" align="center" mb={2}>
        <Heading size="sm">Quesiti</Heading>
        <Button
          leftIcon={<AddIcon />}
          onClick={() =>
            questionsArray.append({
              qid: newId('q'),
              narration: '',
              question: '',
              correctAnswers: [''],
            })
          }
        >
          Aggiungi Quesito
        </Button>
      </Flex>

      {questionsArray.fields.map((q: any, qIndex: number) => (
        <Box key={q.id} borderWidth="1px" borderRadius="md" p={3} mb={4}>
          <Flex justify="space-between" align="center" mb={2}>
            <Text fontWeight="bold">Quesito {qIndex + 1}</Text>
            <IconButton
              aria-label="Rimuovi quesito"
              icon={<CloseIcon />}
              colorScheme="red"
              size="sm"
              onClick={() => questionsArray.remove(qIndex)}
            />
          </Flex>

          {/* Campi del quesito */}
          <TextField
            label="Narrazione"
            name={`data.questions.${qIndex}.narration`}
            isTextArea
          />
          <TextField
            label="Domanda"
            name={`data.questions.${qIndex}.question`}
            isTextArea
          />

          <Divider my={3} />

          <Heading size="xs" mb={2}>
            Risposte corrette (lista)
          </Heading>

          {/* Campo generico: array di stringhe */}
          <StringArrayField
            name={`data.questions.${qIndex}.correctAnswers`}
            itemLabel="Risposta corretta"
            addLabel="Aggiungi risposta corretta"
            defaultItemValue=""
            keepAtLeastOne
          />
        </Box>
      ))}
    </>
  );
};

export default EmotionAttributionTestNodeProperties;
