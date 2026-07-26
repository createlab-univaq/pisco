import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import { Box, Button, Divider, Flex, Heading, Stack } from '@chakra-ui/react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import MultiSelectAnswersField from '../../Forms/Fields/MultiSelectAnswersField';
import TextField from '../../Forms/Fields/TextField';
import NodeProperties from './NodeProperties';

// Genera un id con fallback (compatibile)
const newId = (prefix: string) =>
  globalThis.crypto?.randomUUID?.() ??
  `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;

type SectionEditorProps = {
  itemIndex: number;
  sectionIndex: number;
  onRemoveSection: () => void;
};

const SectionEditor = ({
  itemIndex,
  sectionIndex,
  onRemoveSection,
}: SectionEditorProps) => {
  // Base path della sezione corrente
  const sName = `data.items.${itemIndex}.sections.${sectionIndex}`;

  return (
    <Box borderWidth="1px" borderRadius="md" p={3}>
      <Flex justify="space-between" align="center" mb={2}>
        <Heading size="xs">Sezione #{sectionIndex + 1}</Heading>
        <Button
          size="xs"
          colorScheme="red"
          leftIcon={<CloseIcon />}
          onClick={onRemoveSection}
        >
          Rimuovi sezione
        </Button>
      </Flex>

      {/* Testo spezzato in 3 parti: before, bold, after */}
      <TextField label="Testo iniziale" name={`${sName}.before`} isTextArea />
      <TextField label="Parte in grassetto" name={`${sName}.bold`} />
      <TextField label="Testo finale" name={`${sName}.after`} isTextArea />

      <Divider my={3} />

      {/* Answers + correctIndexes gestiti insieme */}
      <MultiSelectAnswersField
        label="Risposte"
        answersName={`${sName}.answers`}
        correctIndexesName={`${sName}.correctIndexes`}
      />
    </Box>
  );
};

type ItemEditorProps = {
  itemIndex: number;
  onRemoveItem: () => void;
};

const ItemEditor = ({ itemIndex, onRemoveItem }: ItemEditorProps) => {
  const { control } = useFormContext();
  const itemName = `data.items.${itemIndex}`;

  // Array delle sezioni per questo quesito
  const sectionsArray = useFieldArray({
    control,
    name: `${itemName}.sections` as const,
  });

  return (
    <Box borderWidth="1px" borderRadius="md" p={3}>
      <Flex justify="space-between" align="center" mb={2}>
        <Heading size="sm">Quesito #{itemIndex + 1}</Heading>
        <Button
          size="sm"
          colorScheme="red"
          leftIcon={<CloseIcon />}
          onClick={onRemoveItem}
        >
          Rimuovi quesito
        </Button>
      </Flex>

      <Flex mt={3} justify="space-between" align="center">
        <Heading size="xs">Sezioni</Heading>
        <Button
          size="xs"
          leftIcon={<AddIcon />}
          onClick={() =>
            sectionsArray.append({
              before: '',
              bold: '',
              after: '',
              // nuovo formato answers
              answers: [{ text: '', score: 0 }],
              correctIndexes: [],
            })
          }
        >
          Aggiungi sezione
        </Button>
      </Flex>

      <Stack spacing={3} mt={2}>
        {sectionsArray.fields.map((s, sectionIndex) => (
          <SectionEditor
            key={s.id}
            itemIndex={itemIndex}
            sectionIndex={sectionIndex}
            onRemoveSection={() => sectionsArray.remove(sectionIndex)}
          />
        ))}
      </Stack>
    </Box>
  );
};

const SocialSituationsNodeProperties = () => {
  const { control } = useFormContext();

  // Array dei quesiti (items)
  const itemsArray = useFieldArray({
    control,
    name: 'data.items',
  });

  return (
    <>
      <NodeProperties platform={['WebApp']} />

      <Divider my={2} />

      <Flex p={2} justify="space-between" align="center">
        <Heading size="sm">Quesiti</Heading>
        <Button
          size="sm"
          colorScheme="green"
          leftIcon={<AddIcon />}
          onClick={() =>
            itemsArray.append({
              sid: newId('sid'),
              sections: [],
            })
          }
        >
          Aggiungi quesito
        </Button>
      </Flex>

      <Stack spacing={4} p={2}>
        {itemsArray.fields.map((it, itemIndex) => (
          <ItemEditor
            key={it.id}
            itemIndex={itemIndex}
            onRemoveItem={() => itemsArray.remove(itemIndex)}
          />
        ))}
      </Stack>
    </>
  );
};

export default SocialSituationsNodeProperties;
