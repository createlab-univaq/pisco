import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  Heading,
  Select,
  Stack,
} from '@chakra-ui/react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import SingleSelectAnswersField from '../../Forms/Fields/SingleSelectAnswersField';
import TextField from '../../Forms/Fields/TextField';
import NodeProperties from './NodeProperties';

const newId = (prefix: string) =>
  globalThis.crypto?.randomUUID?.() ??
  `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;

/* ---------------- Question ---------------- */

const QuestionEditor = ({ qqName, questionsName, index, onRemove }: any) => {
  const { control, register } = useFormContext();

  const questions = useWatch({
    control,
    name: questionsName,
  });

  const skipQuestionIndex = useWatch({
    control,
    name: `${qqName}.skipIf.questionIndex`,
  });

  const previousQuestions = questions?.slice(0, index) ?? [];
  const selectedPreviousQuestion =
    skipQuestionIndex !== null && skipQuestionIndex !== undefined
      ? previousQuestions?.[skipQuestionIndex]
      : null;

  return (
    <Box borderWidth="1px" borderRadius="md" p={3}>
      <Flex justify="space-between" align="center" mb={2}>
        <Heading size="xs">Q{index + 1}</Heading>
        <Button
          size="xs"
          colorScheme="red"
          leftIcon={<CloseIcon />}
          onClick={onRemove}
        >
          Remove
        </Button>
      </Flex>

      <TextField label="Question" name={`${qqName}.question`} />

      <SingleSelectAnswersField
        label="Answers"
        answersName={`${qqName}.answers`}
        correctIndexName={`${qqName}.correctIndex`}
        minAnswers={2}
        defaultAnswers={['Si', 'No']}
      />

      {index > 0 && (
        <Box mt={3} p={3} borderWidth="1px" borderRadius="md">
          <Checkbox {...register(`${qqName}.skipIf.enabled`)}>
            Skippa questa domanda in base a una risposta precedente
          </Checkbox>

          <Stack spacing={2} mt={2}>
            <Select
              placeholder="Domanda precedente"
              {...register(`${qqName}.skipIf.questionIndex`, {
                setValueAs: (value) => (value === '' ? null : Number(value)),
              })}
            >
              {previousQuestions.map((question: any, i: number) => (
                <option key={i} value={i}>
                  Q{i + 1}: {question.question || 'Senza testo'}
                </option>
              ))}
            </Select>

            <Select
              placeholder="Risposta che fa skippare"
              {...register(`${qqName}.skipIf.answerIndex`, {
                setValueAs: (value) => (value === '' ? null : Number(value)),
              })}
            >
              {(selectedPreviousQuestion?.answers ?? []).map(
                (answer: string, i: number) => (
                  <option key={i} value={i}>
                    {answer || `Risposta ${i + 1}`}
                  </option>
                )
              )}
            </Select>
          </Stack>
        </Box>
      )}
    </Box>
  );
};

/* ---------------- Story ---------------- */

const StoryEditor = ({ index, onRemove }: any) => {
  const { control } = useFormContext();
  const qName = `data.quiz.${index}`;

  const questions = useFieldArray({
    control,
    name: `${qName}.questions`,
  });

  return (
    <Box borderWidth="1px" borderRadius="md" p={3}>
      <Flex justify="space-between" align="center" mb={2}>
        <Heading size="xs">Story #{index + 1}</Heading>
        <Button
          size="xs"
          colorScheme="red"
          leftIcon={<CloseIcon />}
          onClick={onRemove}
        >
          Remove story
        </Button>
      </Flex>

      <TextField label="Narration" name={`${qName}.narration`} isTextArea />

      <Flex mt={3} justify="space-between">
        <Heading size="xs">Questions</Heading>
        <Button
          size="xs"
          leftIcon={<AddIcon />}
          onClick={() =>
            questions.append({
              question: '',
              answers: ['Si', 'No'],
              correctIndex: 0,
              skipIf: {
                enabled: false,
                questionIndex: null,
                answerIndex: null,
              },
            })
          }
        >
          Add question
        </Button>
      </Flex>

      <Stack spacing={3} mt={2}>
        {questions.fields.map((q, i) => (
          <QuestionEditor
            key={q.id}
            qqName={`${qName}.questions.${i}`}
            questionsName={`${qName}.questions`}
            index={i}
            onRemove={() => questions.remove(i)}
          />
        ))}
      </Stack>
    </Box>
  );
};

/* ---------------- Root ---------------- */

const FauxPasNodeProperties = () => {
  const { control } = useFormContext();

  const quiz = useFieldArray({
    control,
    name: 'data.quiz',
  });

  return (
    <>
      <NodeProperties platform={['WebApp']} />

      <Divider my={2} />

      <Flex p={2} justify="space-between" align="center">
        <Heading size="sm">Stories</Heading>
        <Button
          size="sm"
          leftIcon={<AddIcon />}
          colorScheme="green"
          onClick={() =>
            quiz.append({
              qid: newId('qid'),
              narration: '',
              questions: [],
            })
          }
        >
          Add story
        </Button>
      </Flex>

      <Stack spacing={4} p={2}>
        {quiz.fields.map((q, i) => (
          <StoryEditor key={q.id} index={i} onRemove={() => quiz.remove(i)} />
        ))}
      </Stack>
    </>
  );
};

export default FauxPasNodeProperties;
