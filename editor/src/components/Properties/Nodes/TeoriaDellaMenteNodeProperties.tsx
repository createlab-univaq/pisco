import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import { Box, Button, Divider, Flex, Heading, Stack } from '@chakra-ui/react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import SingleSelectAnswersField from '../../Forms/Fields/SingleSelectAnswersField';
import TextField from '../../Forms/Fields/TextField';
import NodeProperties from './NodeProperties';

const newId = (prefix: string) =>
  globalThis.crypto?.randomUUID?.() ??
  `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;

/* ---------------- Question ---------------- */

const QuestionEditor = ({ qqName, index, onRemove }: any) => (
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
      allowNoCorrect={false}
    />
  </Box>
);

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
            index={i}
            onRemove={() => questions.remove(i)}
          />
        ))}
      </Stack>
    </Box>
  );
};

/* ---------------- Root ---------------- */

const TeoriaDellaMenteNodeProperties = () => {
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

export default TeoriaDellaMenteNodeProperties;
