import { Box, Button, Divider, Heading, HStack, Text } from '@chakra-ui/react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import TextField from '../../Forms/Fields/TextField';

type Props = {
  /**
   * Prefisso del path nel form:
   * - Nodo singolo: "data"
   * - Dentro container: "data.items.0" (esempio)
   */
  basePath: string;

  isDisabled?: boolean;
};

const path = (basePath: string, field: string) => `${basePath}.${field}`;

const EmotionAttributionBEmbedded = ({ basePath, isDisabled }: Props) => {
  const { control } = useFormContext();

  const itemsPath = path(basePath, 'items');

  const { fields, append, remove } = useFieldArray({
    control,
    name: itemsPath,
  });

  return (
    <>
      <Heading size="xs" mb={2}>
        Elementi (lista)
      </Heading>

      <Text fontSize="sm" color="gray.600" mb={3}>
        Ogni elemento è composto da Emozione, Scenario e Spiegazione dello
        scenario.
      </Text>

      <Button
        size="sm"
        mb={3}
        onClick={() =>
          append({
            emotion: '',
            scenario: '',
            scenarioExplanation: '',
          })
        }
        isDisabled={isDisabled}
      >
        Aggiungi elemento
      </Button>

      <Divider my={3} />

      {fields.length === 0 ? (
        <Text fontSize="sm" color="gray.500">
          Nessun elemento inserito.
        </Text>
      ) : (
        fields.map((field, index) => (
          <Box key={field.id} borderWidth="1px" borderRadius="md" p={3} mb={3}>
            <HStack justify="space-between" align="center" mb={2}>
              <Heading size="xs">Elemento {index + 1}</Heading>
              <Button
                size="xs"
                variant="outline"
                onClick={() => remove(index)}
                isDisabled={isDisabled}
              >
                Rimuovi
              </Button>
            </HStack>

            <TextField
              label="Emozione"
              name={`${itemsPath}.${index}.emotion`}
              isDisabled={isDisabled}
            />

            <TextField
              label="Scenario"
              name={`${itemsPath}.${index}.scenario`}
              isTextArea
              isDisabled={isDisabled}
            />

            <TextField
              label="Spiegazione scenario"
              name={`${itemsPath}.${index}.scenarioExplanation`}
              isTextArea
              isDisabled={isDisabled}
            />
          </Box>
        ))
      )}
    </>
  );
};

export default EmotionAttributionBEmbedded;
