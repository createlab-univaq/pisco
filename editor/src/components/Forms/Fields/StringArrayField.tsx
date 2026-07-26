import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, IconButton, Stack } from '@chakra-ui/react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import TextField from './TextField';

type StringArrayFieldProps = {
  // Path RHF dell'array (es: "data.questions.0.correctAnswers")
  name: string;

  // Label base (es: "Risposta corretta")
  itemLabel?: string;

  // Testo bottone add
  addLabel?: string;

  // Placeholder degli input (opzionale)
  placeholder?: string;

  // Valore di default che viene aggiunto quando premi "Aggiungi"
  defaultItemValue?: string;

  // Se true, impedisce di scendere sotto 1 elemento
  keepAtLeastOne?: boolean;
};

/**
 * Campo generico per gestire un array di stringhe in React Hook Form.
 * Esempio: correctAnswers: string[]
 */
const StringArrayField = ({
  name,
  itemLabel = 'Elemento',
  addLabel = 'Aggiungi',
  placeholder,
  defaultItemValue = '',
  keepAtLeastOne = false,
}: StringArrayFieldProps) => {
  // Prendo il control del form corrente
  const { control } = useFormContext();

  // useFieldArray gestisce l'array e ci dà append/remove + fields per il render
  const arr = useFieldArray({
    control,
    name,
  });

  return (
    <Stack spacing={2}>
      {arr.fields.map((f: any, index: number) => {
        const canRemove = keepAtLeastOne ? arr.fields.length > 1 : true;

        return (
          <Flex key={f.id} align="center" gap={2}>
            <Box flex="1">
              {/* TextField è già integrato con RHF tramite "name" */}
              <TextField
                label={`${itemLabel} ${index + 1}`}
                name={`${name}.${index}`}
                placeholder={placeholder}
              />
            </Box>

            <IconButton
              aria-label="Rimuovi"
              icon={<CloseIcon />}
              colorScheme="red"
              size="sm"
              isDisabled={!canRemove}
              onClick={() => arr.remove(index)}
            />
          </Flex>
        );
      })}

      <Button
        leftIcon={<AddIcon />}
        variant="outline"
        width="fit-content"
        onClick={() => arr.append(defaultItemValue)}
      >
        {addLabel}
      </Button>
    </Stack>
  );
};

export default StringArrayField;
