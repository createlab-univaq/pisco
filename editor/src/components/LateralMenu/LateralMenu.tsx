import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
} from '@chakra-ui/react';
import Image from 'next/image';
import { DragEvent } from 'react';
import { polyglotNodeComponentMapping } from '../../types/polyglotElements';

interface NodeItem {
  key: string;
  text: string;
  icon: string;
  index: string; // nodeType
}

export type LateralMenuProps = {
  isOpen: boolean;
};

const ITEM_COLORS = ['#FFCC49', '#FFF0C8'];

/** Sezioni richieste + nodi visibili */
const MENU_SECTIONS: Array<{
  label: string;
  nodes: string[];
}> = [
  {
    label: 'Test',
    nodes: [
      'EmotionAttributionTestNode',
      'EyesTaskTestNode',
      'socialSituationsNode',
      'TeoriaDellaMenteNode',
      'FauxPasNode',
    ],
  },
  {
    label: 'Esercitazioni',
    nodes: [
      'ContainerNode',
      'EmotionAttributionANode',
      'EmotionAttributionBNode',
      'SocialSituationExerciseANode',
      'RiconoscimentoEmozioniNode',
    ],
  },
];

const LateralMenu = ({ isOpen }: LateralMenuProps) => {
  if (!isOpen) return <></>;

  const onDragStart = (event: DragEvent<HTMLDivElement>, nodeType: string) => {
    if (!event.dataTransfer) return;
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  // Tutti i nodi definiti nel mapping
  const allNodes: NodeItem[] = Object.keys(
    polyglotNodeComponentMapping.nameMapping
  ).map((index, id) => ({
    key: id.toString(),
    text: polyglotNodeComponentMapping.nameMapping[index],
    icon: polyglotNodeComponentMapping.iconMapping[index] ?? '',
    index,
  }));

  // Helper: dato un array di nodeType, ritorna gli oggetti NodeItem (in quell’ordine)
  const pickNodesInOrder = (types: string[]) =>
    types
      .map((t) => allNodes.find((n) => n.index === t))
      .filter(Boolean) as NodeItem[];

  return (
    <Box w="300px" backgroundColor="rgba(217, 217, 217, 0.6)">
      <div className="label">NEW ACTIVITY</div>

      <Box height="100%" overflowY="auto" paddingBottom="15%">
        <Accordion allowMultiple defaultIndex={[0, 1]}>
          {MENU_SECTIONS.map((section) => {
            const sectionNodes = pickNodesInOrder(section.nodes);

            // Se per qualche motivo nel mapping mancasse un nodo, la sezione rimane ma vuota.
            return (
              <AccordionItem key={section.label} border="none">
                {({ isExpanded }) => (
                  <>
                    <AccordionButton
                      padding="10px 12px"
                      _hover={{ backgroundColor: 'rgba(0,0,0,0.06)' }}
                    >
                      <Box flex="1" textAlign="left" fontWeight="600">
                        {section.label}
                      </Box>
                      {isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
                    </AccordionButton>

                    <AccordionPanel padding="6px 8px 10px 8px">
                      {sectionNodes.map((node, idx) => {
                        const bgColor = ITEM_COLORS[idx % ITEM_COLORS.length];

                        return (
                          <Box
                            key={`${section.label}-${node.index}`}
                            id={node.key}
                            display="flex"
                            alignItems="center"
                            gap="8px"
                            padding="8px"
                            marginBottom="6px"
                            backgroundColor={bgColor}
                            cursor="grab"
                            fontSize={{ base: '10px', md: '12px', xl: '14px' }}
                            draggable
                            title="Drag the new Node type"
                            onDragStart={(event) =>
                              onDragStart(event, node.index)
                            }
                            _hover={{ backgroundColor: '#e6b83f' }}
                            borderRadius="6px"
                          >
                            <Image
                              alt="Node icon"
                              src={node.icon}
                              width={20}
                              height={20}
                            />
                            {node.text}
                          </Box>
                        );
                      })}

                      {sectionNodes.length === 0 ? (
                        <Box
                          padding="8px"
                          fontSize={{ base: '10px', md: '12px' }}
                          opacity={0.7}
                        >
                          Nessun nodo disponibile in questa sezione.
                        </Box>
                      ) : null}
                    </AccordionPanel>
                  </>
                )}
              </AccordionItem>
            );
          })}
        </Accordion>
      </Box>
    </Box>
  );
};

export default LateralMenu;
