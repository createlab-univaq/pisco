import { AddIcon, ArrowBackIcon, DeleteIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  IconButton,
  Select,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import React, { useMemo, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { API } from '../../../data/api';
import useStore from '../../../store';
import { CONTAINER_NODE_ALLOWED_TYPES } from '../../../types/polyglotElements/nodes/ContainerNode';
import { embeddedByType } from '../../Embedded/embeddedRegistry';
import TextField from '../../Forms/Fields/TextField';
import NodeProperties from './NodeProperties';

const uid = () => Math.random().toString(36).slice(2, 10);

type DrillState =
  | { mode: 'list' }
  | { mode: 'edit'; sectionIndex: number; itemIndex: number };

type SectionBlockProps = {
  sectionIndex: number;
  sectionId: string;
  onRemoveSection: (sectionIndex: number) => void;
  onOpenItem: (sectionIndex: number, itemIndex: number) => void;
  allowedTypes: readonly string[];
  containerNodeId?: string;
};

const SectionBlock = ({
  sectionIndex,
  sectionId,
  onRemoveSection,
  onOpenItem,
  allowedTypes,
  containerNodeId,
}: SectionBlockProps) => {
  const toast = useToast();
  const { control, getValues } = useFormContext();

  const itemsFA = useFieldArray({
    control,
    name: `data.sections.${sectionIndex}.items`,
  });

  const allowedDefs = useMemo(() => {
    return allowedTypes.map((t) => embeddedByType[t]).filter(Boolean);
  }, [allowedTypes]);

  const addItem = (type: string) => {
    const def = embeddedByType[type];
    itemsFA.append({
      id: uid(),
      type,
      title: def?.label ?? type,
      data: def?.createDefaultData?.() ?? {},
    });
  };

  const removeItem = async (itemIndex: number) => {
    const itemId = getValues(
      `data.sections.${sectionIndex}.items.${itemIndex}.id`
    ) as string | undefined;

    // Se non ho ids affidabili, rimuovo e basta (niente cleanup)
    if (!containerNodeId || !itemId) {
      itemsFA.remove(itemIndex);
      return;
    }

    try {
      // elimina tutti i file associati a quell'item
      if ((API as any).deleteItemFiles) {
        await (API as any).deleteItemFiles({ nodeId: containerNodeId, itemId });
      }

      // poi rimuovo l'item dal form
      itemsFA.remove(itemIndex);

      toast({
        title: 'Nodo rimosso',
        description: 'File associati eliminati correttamente.',
        status: 'success',
        duration: 2500,
        position: 'bottom-left',
        isClosable: true,
      });
    } catch (e) {
      console.error('deleteItemFiles error', e);
      toast({
        title: 'Impossibile eliminare i file',
        description:
          'Non sono riuscito a eliminare i file associati a questo item. Riprova.',
        status: 'warning',
        duration: 3500,
        position: 'bottom-left',
        isClosable: true,
      });

      // Scelta UX: NON rimuovo l’item se non ho eliminato i file
      // (evita orphan files e perdita del riferimento)
    }
  };

  return (
    <Box key={sectionId} borderWidth="1px" borderRadius="md" p={3}>
      <Flex justify="space-between" align="center" mb={2}>
        <Heading size="xs">Sezione {sectionIndex + 1}</Heading>

        <IconButton
          aria-label="Rimuovi sezione"
          icon={<DeleteIcon />}
          size="sm"
          variant="ghost"
          colorScheme="red"
          onClick={() => onRemoveSection(sectionIndex)}
        />
      </Flex>

      <Divider my={3} />

      <HStack mb={2} justify="space-between">
        <Heading size="xs">Nodi</Heading>

        <Select
          placeholder="Aggiungi nodo..."
          size="sm"
          onChange={(e) => {
            const type = e.target.value;
            if (type) addItem(type);
            e.target.value = '';
          }}
          width="260px"
        >
          {allowedDefs.map((d) => (
            <option key={d.type} value={d.type}>
              {d.label}
            </option>
          ))}
        </Select>
      </HStack>

      {itemsFA.fields.length === 0 ? (
        <Text fontSize="sm" color="gray.600">
          Nessun nodo in questa sezione.
        </Text>
      ) : (
        <VStack align="stretch" spacing={2}>
          {itemsFA.fields.map((item, itemIndex) => {
            const type = getValues(
              `data.sections.${sectionIndex}.items.${itemIndex}.type`
            ) as string;

            const def = embeddedByType[type];

            const title = getValues(
              `data.sections.${sectionIndex}.items.${itemIndex}.title`
            ) as string;

            return (
              <Box
                key={item.id}
                borderWidth="1px"
                borderRadius="md"
                p={2}
                cursor="pointer"
                _hover={{ bg: 'gray.50' }}
                onClick={() => onOpenItem(sectionIndex, itemIndex)}
              >
                <Flex align="center" justify="space-between">
                  <HStack spacing={2}>
                    {def?.icon ? (
                      <img
                        src={def.icon}
                        width="18"
                        height="18"
                        alt={def.label}
                      />
                    ) : null}

                    <Box>
                      <Text fontWeight="600" fontSize="sm">
                        {title || def?.label || type}
                      </Text>
                    </Box>
                  </HStack>

                  <IconButton
                    aria-label="Rimuovi nodo"
                    icon={<DeleteIcon />}
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    onClick={(ev) => {
                      ev.stopPropagation();
                      void removeItem(itemIndex);
                    }}
                  />
                </Flex>
              </Box>
            );
          })}
        </VStack>
      )}
    </Box>
  );
};

const ContainerNodeProperties = () => {
  const { control, getValues } = useFormContext();
  const [drill, setDrill] = useState<DrillState>({ mode: 'list' });

  const selectedElement = useStore((store: any) => {
    const v = store.getSelectedElement;
    return typeof v === 'function' ? v() : v;
  });
  const containerNodeId = selectedElement?._id as string | undefined;

  const sectionsFA = useFieldArray({
    control,
    name: 'data.sections',
  });

  const addSection = () => {
    sectionsFA.append({
      id: uid(),
      items: [],
    });
  };

  // -------------------
  // EDIT VIEW (child)
  // -------------------
  if (drill.mode === 'edit') {
    const { sectionIndex, itemIndex } = drill;

    const itemType = getValues(
      `data.sections.${sectionIndex}.items.${itemIndex}.type`
    ) as string;

    const itemId = getValues(
      `data.sections.${sectionIndex}.items.${itemIndex}.id`
    ) as string;

    const def = embeddedByType[itemType];
    const Embedded = def?.component;

    return (
      <>
        <Button
          leftIcon={<ArrowBackIcon />}
          variant="ghost"
          onClick={() => setDrill({ mode: 'list' })}
          mb={2}
        >
          Torna alle sezioni
        </Button>

        <Box borderWidth="1px" borderRadius="md" p={3}>
          <Heading size="sm" mb={2}>
            {def?.label ?? itemType}
          </Heading>

          <TextField
            label="Titolo (card)"
            name={`data.sections.${sectionIndex}.items.${itemIndex}.title`}
          />

          <Divider my={3} />

          {Embedded ? (
            containerNodeId ? (
              <Embedded
                basePath={`data.sections.${sectionIndex}.items.${itemIndex}.data`}
                parentNodeId={containerNodeId}
                parentItemId={itemId}
              />
            ) : (
              <Text fontSize="xs" opacity={0.6} mt={2}>
                Seleziona il nodo container per caricare un’immagine.
              </Text>
            )
          ) : (
            <Text color="red.500">
              Tipo embedded non registrato: {String(itemType)}
            </Text>
          )}
        </Box>
      </>
    );
  }

  // -------------------
  // LIST VIEW (container)
  // -------------------
  return (
    <>
      <NodeProperties
        platform={['WebApp']}
        activityDescription="Nodo contenitore: crea sezioni e inserisci nodi. Clicca una card per compilare il nodo interno."
      />

      <Divider my={3} />

      <Flex align="center" justify="space-between" mb={2}>
        <Heading size="sm">Sezioni</Heading>
        <Button leftIcon={<AddIcon />} onClick={addSection} size="sm">
          Aggiungi sezione
        </Button>
      </Flex>

      <VStack spacing={3} align="stretch">
        {sectionsFA.fields.map((section, sectionIndex) => (
          <SectionBlock
            key={section.id}
            sectionId={section.id}
            sectionIndex={sectionIndex}
            allowedTypes={CONTAINER_NODE_ALLOWED_TYPES}
            onRemoveSection={sectionsFA.remove}
            onOpenItem={(s, i) =>
              setDrill({ mode: 'edit', sectionIndex: s, itemIndex: i })
            }
            containerNodeId={containerNodeId}
          />
        ))}
      </VStack>
    </>
  );
};

export default ContainerNodeProperties;
