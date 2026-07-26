import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Input,
  Radio,
  RadioGroup,
  Stack,
} from '@chakra-ui/react';
import { useFormContext, useWatch } from 'react-hook-form';

type Props = {
  label: string;

  // Path RHF (es: "data.quiz.0.questions.0.answers")
  answersName: string;

  // Path RHF (es: "data.quiz.0.questions.0.correctIndex")
  // NB: ora può essere number | null
  correctIndexName: string;

  // Minimo numero di risposte da mantenere (default: 2)
  minAnswers?: number;

  // Valori iniziali suggeriti (default: ['',''])
  defaultAnswers?: string[];

  // NEW: se true, permette "nessuna risposta corretta" (Faux Pas)
  allowNoCorrect?: boolean;

  // NEW: label della scelta "nessuna corretta"
  noCorrectLabel?: string;
};

/**
 * Field generico per gestire:
 * - answers: string[]
 * - correctIndex: number | null
 *
 * Modalità:
 * - standard: UNA SOLA risposta corretta (radio)
 * - allowNoCorrect: permette anche "nessuna risposta corretta" (correctIndex = null)
 *
 * Include:
 * - add/remove answer
 * - garantisce almeno minAnswers risposte
 * - mantiene correctIndex dentro range (solo se correctIndex è un numero)
 */
const SingleSelectAnswersField = ({
  label,
  answersName,
  correctIndexName,
  minAnswers = 2,
  defaultAnswers = ['', ''],
  allowNoCorrect = false,
  noCorrectLabel = 'Nessuna risposta corretta',
}: Props) => {
  const { control, setValue } = useFormContext();

  // Risposte correnti
  const answers =
    (useWatch({ control, name: answersName as any }) as string[]) ?? [];

  // correctIndex corrente (può essere number, string, null, undefined)
  const correctIndexRaw = useWatch({
    control,
    name: correctIndexName as any,
  });

  // Interpreto correctIndex:
  // - se null/undefined => null (nessuna corretta) SOLO se allowNoCorrect, altrimenti 0
  // - se number/string numerico => number
  const parsedNumber = Number(correctIndexRaw);
  const isNumeric = Number.isFinite(parsedNumber);

  const correctIndex: number | null =
    correctIndexRaw == null
      ? allowNoCorrect
        ? null
        : 0
      : isNumeric
      ? parsedNumber
      : allowNoCorrect
      ? null
      : 0;

  // Normalizza answers + clamp correctIndex se serve
  const setAnswers = (next: string[]) => {
    // Mantengo almeno minAnswers risposte
    const normalized =
      next.length >= minAnswers
        ? next
        : [
            ...next,
            ...Array.from({ length: minAnswers - next.length }, () => ''),
          ];

    setValue(answersName as any, normalized, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });

    // Se correctIndex è un numero, lo tengo dentro range
    if (typeof correctIndex === 'number') {
      const maxIndex = Math.max(0, normalized.length - 1);
      if (correctIndex > maxIndex) {
        setValue(correctIndexName as any, maxIndex, {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        });
      }
    }
  };

  // Se l'array è vuoto (es. nodo appena creato o legacy), inizializzo
  const effectiveAnswers = answers.length ? answers : defaultAnswers;

  // Valore RadioGroup:
  // - se correctIndex è null => "none"
  // - altrimenti => indice come stringa
  const radioValue =
    correctIndex === null
      ? 'none'
      : String(
          Math.min(correctIndex, Math.max(0, effectiveAnswers.length - 1))
        );

  return (
    <Box mt={3}>
      <Heading size="xs" mb={1}>
        {label}
      </Heading>

      <RadioGroup
        value={radioValue}
        onChange={(val) => {
          // Se seleziono "none" => correctIndex = null
          if (allowNoCorrect && val === 'none') {
            setValue(correctIndexName as any, null, {
              shouldDirty: true,
              shouldTouch: true,
              shouldValidate: true,
            });
            return;
          }

          // Altrimenti => numero
          setValue(correctIndexName as any, Number(val), {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
          });
        }}
      >
        <Stack spacing={2}>
          {/* Opzione "nessuna corretta" disponibile solo in Faux Pas */}
          {allowNoCorrect && (
            <Flex align="center" gap={2}>
              <Radio value="none" />
              <Box>{noCorrectLabel}</Box>
            </Flex>
          )}

          {effectiveAnswers.map((answer, idx) => (
            <Flex key={idx} align="center" gap={2}>
              <Radio value={String(idx)} />

              <Input
                value={answer ?? ''}
                placeholder={`Answer ${idx + 1}`}
                onChange={(e) => {
                  const updated = [...effectiveAnswers];
                  updated[idx] = e.target.value;
                  setAnswers(updated);
                }}
              />

              <IconButton
                aria-label="Remove answer"
                size="sm"
                icon={<CloseIcon />}
                onClick={() =>
                  setAnswers(effectiveAnswers.filter((_, i) => i !== idx))
                }
                isDisabled={effectiveAnswers.length <= minAnswers}
              />
            </Flex>
          ))}
        </Stack>
      </RadioGroup>

      <Button
        size="xs"
        mt={2}
        leftIcon={<AddIcon />}
        onClick={() => setAnswers([...effectiveAnswers, ''])}
      >
        Add answer
      </Button>
    </Box>
  );
};

export default SingleSelectAnswersField;
