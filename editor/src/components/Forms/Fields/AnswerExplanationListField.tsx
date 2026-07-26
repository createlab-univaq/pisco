import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Radio,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { useEffect, useMemo } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

export type AnswerExplanationItem = {
  answer: string;
  explanation: string;
};

type Props = {
  label: string;
  name: string; // e.g. "data.items"
  correctIndexName: string; // e.g. "data.correctIndex"
  answerLabel?: string;
  explanationLabel?: string;
  isDisabled?: boolean;
  /** se true, impedisce lista vuota lasciando almeno 1 elemento */
  keepAtLeastOne?: boolean;
};

const AnswerExplanationListField = ({
  label,
  name,
  correctIndexName,
  answerLabel = 'Risposta',
  explanationLabel = 'Spiegazione',
  isDisabled,
  keepAtLeastOne = true,
}: Props) => {
  const { control, register, setValue, unregister } = useFormContext();

  // evita “trascinamento” di items tra nodi quando cambi properties panel
  useEffect(() => {
    return () => {
      unregister(name);
    };
  }, [name, unregister]);

  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  const correctIndex = useWatch({ control, name: correctIndexName }) as
    | number
    | undefined;

  const safeCorrectIndex = useMemo(() => {
    const v = typeof correctIndex === 'number' ? correctIndex : 0;
    if (fields.length === 0) return 0;
    return Math.min(Math.max(v, 0), fields.length - 1);
  }, [correctIndex, fields.length]);

  // clamp se fuori range
  useEffect(() => {
    if (fields.length === 0) {
      setValue(correctIndexName, 0, { shouldDirty: true });
      return;
    }
    if (safeCorrectIndex !== correctIndex) {
      setValue(correctIndexName, safeCorrectIndex, { shouldDirty: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields.length]);

  const setCorrect = (index: number) => {
    setValue(correctIndexName, index, { shouldDirty: true, shouldTouch: true });
  };

  const onAddEmptyRow = () => {
    const wasEmpty = fields.length === 0;
    append({ answer: '', explanation: '' });

    // se era vuota, la prima aggiunta diventa corretta
    if (wasEmpty) setCorrect(0);
  };

  const onRemove = (index: number) => {
    // se vuoi impedire lista vuota
    if (keepAtLeastOne && fields.length <= 1) return;

    const current = safeCorrectIndex;

    remove(index);

    // aggiusta correctIndex
    if (fields.length <= 1) {
      setValue(correctIndexName, 0, { shouldDirty: true });
      return;
    }

    if (index === current) {
      setValue(correctIndexName, 0, { shouldDirty: true });
      return;
    }

    if (index < current) {
      setValue(correctIndexName, current - 1, { shouldDirty: true });
    }
  };

  return (
    <FormControl>
      <Flex justifyContent="space-between" alignItems="center" mb={2}>
        <FormLabel mb={0}>{label}</FormLabel>

        <Button
          size="sm"
          colorScheme="green"
          leftIcon={<AddIcon boxSize="0.75em" />}
          onClick={onAddEmptyRow}
          isDisabled={isDisabled}
        >
          Aggiungi risposta
        </Button>
      </Flex>

      {fields.length === 0 && (
        <Box mb={3} color="gray.600" fontSize="sm">
          Nessuna risposta. Clicca “Aggiungi risposta”.
        </Box>
      )}

      {fields.map((f: any, index: number) => {
        const isCorrect = safeCorrectIndex === index;
        const disableRemove =
          isDisabled || (keepAtLeastOne && fields.length <= 1);

        return (
          <Box
            key={f.id}
            border="1px solid"
            borderColor={isCorrect ? 'purple.300' : 'gray.200'}
            borderRadius="8px"
            padding={3}
            marginBottom={3}
            opacity={isDisabled ? 0.7 : 1}
          >
            <Flex justifyContent="space-between" alignItems="center" mb={2}>
              <Flex alignItems="center" gap={3}>
                <Radio
                  isChecked={isCorrect}
                  onChange={() => setCorrect(index)}
                  isDisabled={isDisabled}
                >
                  <Text fontWeight={600} fontSize="sm">
                    Corretta
                  </Text>
                </Radio>

                <Text fontWeight={600} fontSize="sm" color="gray.600">
                  Opzione {index + 1}
                </Text>
              </Flex>

              <Button
                colorScheme="red"
                size="sm"
                onClick={() => onRemove(index)}
                leftIcon={<CloseIcon boxSize="0.75em" />}
                isDisabled={disableRemove}
                title={
                  keepAtLeastOne && fields.length <= 1
                    ? 'Deve rimanere almeno una risposta'
                    : undefined
                }
              >
                Rimuovi
              </Button>
            </Flex>

            <Input
              placeholder={answerLabel}
              borderColor="grey"
              isDisabled={isDisabled}
              {...register(`${name}.${index}.answer`)}
            />
            <Box height={2} />
            <Textarea
              placeholder={explanationLabel}
              borderColor="grey"
              isDisabled={isDisabled}
              {...register(`${name}.${index}.explanation`)}
            />
          </Box>
        );
      })}
    </FormControl>
  );
};

export default AnswerExplanationListField;
