import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  Textarea,
  Tooltip,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import Editor from '@monaco-editor/react';
import { AxiosResponse } from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { APIV2 } from '../../data/api';
import { PolyglotFlow, PolyglotFlowInfo } from '../../types/polyglotElements';

type CreateFlowModalProps = {
  isOpen: boolean;
  onClose: () => void;
  API: APIV2;
};

export const colors = [
  'gray',
  'yellow',
  'orange',
  'red',
  'pink',
  'purple',
  'blue',
  'cyan',
  'teal',
  'green',
];

const CreateFlowModal = ({ isOpen, onClose, API }: CreateFlowModalProps) => {
  const [currentTab, setCurrentTab] = useState(0);
  const [flow, setFlow] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [tagName, setTagName] = useState('');
  const [colorTag, setColorTag] = useState(colors[0]);
  const { isOpen: ioPop, onClose: ocPop, onOpen: opPop } = useDisclosure();
  const [tags, setTags] = useState<{ name: string; color: string }[]>([]);

  const toast = useToast();
  const router = useRouter();

  // reset on reopen
  useEffect(() => {
    if (!isOpen) return;

    setCurrentTab(0);
    setFlow(undefined);
    setLoading(false);

    setTitle('');
    setDescription('');

    setColorTag(colors[0]);
    setTags([]);
    setTagName('');
  }, [isOpen]);

  const normalizedTagName = tagName.trim().toUpperCase();

  const addTag = () => {
    if (!normalizedTagName) return;

    setTags((prev) => {
      const exists = prev.some((t) => t.name === normalizedTagName);
      if (exists) return prev;

      return [...prev, { name: normalizedTagName, color: colorTag }];
    });

    setTagName('');
  };

  const removeTagAt = (index: number) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };

  const createFlow = async () => {
    try {
      let response: AxiosResponse;

      setLoading(true);

      switch (currentTab) {
        case 0: {
          const base_Flow: PolyglotFlowInfo = {
            title: title.trim(),
            description: description.trim(),
            tags,
            publish: false,
            topicsAI: [],
            // non più: duration, learningContext, topics
          };

          response = await API.createNewFlow(base_Flow);
          break;
        }
        case 1: {
          if (!flow) return;
          const poly_flow: PolyglotFlow = JSON.parse(flow);
          response = await API.createNewFlowJson(poly_flow);
          break;
        }
        default:
          console.log('Tab not defined');
          return;
      }

      if (response.status !== 200) {
        onClose();
        toast({
          title: 'Flow not created',
          description: 'Something is off with your flow! Try again',
          status: 'warning',
          duration: 3000,
          position: 'bottom-left',
          isClosable: true,
        });
        return;
      }

      router.push('/flows/' + response.data._id);
    } catch (error: any) {
      if ((error as Error).name === 'SyntaxError') {
        toast({
          title: 'Invalid syntax',
          description: (error as Error).toString(),
          status: 'error',
          duration: 3000,
          position: 'bottom-left',
          isClosable: true,
        });
        return;
      }

      console.log(error);

      if (error?.response?.status) {
        toast({
          title: 'Server Error',
          description:
            'We are sorry, server was not able to create your flow. Error: ' +
            error.response.data.message,
          status: 'error',
          duration: 5000,
          position: 'bottom-left',
          isClosable: true,
        });
      } else {
        toast({
          title: 'Generic Error',
          description: 'Try later ' + (error as Error),
          status: 'error',
          duration: 5000,
          position: 'bottom-left',
          isClosable: true,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const canCreateCustom =
    title.trim().length > 0 && description.trim().length > 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={'2xl'} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Flow</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Tabs onChange={(index) => setCurrentTab(index)}>
            <TabList>
              <Tab>Custom</Tab>
              <Tab>Import JSON</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <FormControl>
                  <FormLabel my={2} fontWeight={'bold'}>
                    Title:
                  </FormLabel>
                  <Input
                    placeholder="Insert title..."
                    value={title}
                    onChange={(e) => setTitle(e.currentTarget.value)}
                  />

                  <FormLabel my={2} fontWeight={'bold'}>
                    Description:
                  </FormLabel>
                  <Textarea
                    placeholder="Insert description..."
                    value={description}
                    onChange={(e) => setDescription(e.currentTarget.value)}
                  />

                  <FormLabel my={2} fontWeight={'bold'}>
                    Tags:
                  </FormLabel>

                  <Flex mb={2} align="center" gap={2}>
                    <Popover isOpen={ioPop} onClose={ocPop}>
                      <PopoverTrigger>
                        <Button
                          colorScheme={colorTag}
                          rounded="md"
                          onClick={opPop}
                          borderWidth={2}
                          borderColor={'gray.300'}
                        />
                      </PopoverTrigger>

                      <Portal>
                        {/* https://github.com/chakra-ui/chakra-ui/issues/3043 */}
                        <Box
                          zIndex="popover"
                          w="full"
                          h="full"
                          position={'relative'}
                        >
                          <PopoverContent>
                            <PopoverArrow />
                            <PopoverHeader>
                              <Text fontWeight={'bold'}>Select Color</Text>
                            </PopoverHeader>
                            <PopoverCloseButton />
                            <PopoverBody>
                              {colors.map((value, id) => (
                                <Button
                                  key={id}
                                  colorScheme={value}
                                  rounded="md"
                                  mr={2}
                                  mb={2}
                                  onClick={() => {
                                    setColorTag(value);
                                    ocPop();
                                  }}
                                />
                              ))}
                            </PopoverBody>
                          </PopoverContent>
                        </Box>
                      </Portal>
                    </Popover>

                    <Tooltip
                      label="Press Enter↵ in the input box to add a tag"
                      placement="top"
                    >
                      <Input
                        placeholder="Insert tag name..."
                        w={'40%'}
                        value={tagName}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addTag();
                          }
                        }}
                        onChange={(e) => setTagName(e.currentTarget.value)}
                      />
                    </Tooltip>

                    <IconButton
                      aria-label="Add Tag"
                      isDisabled={!normalizedTagName}
                      icon={<AddIcon />}
                      rounded="md"
                      onClick={addTag}
                    />
                  </Flex>

                  <Flex wrap="wrap" gap={2}>
                    {tags.map((tag, id) => (
                      <Button
                        key={`${tag.name}-${id}`}
                        variant={'unstyled'}
                        onClick={() => removeTagAt(id)}
                      >
                        <Tag mr={1} colorScheme={tag.color} fontWeight="bold">
                          <TagLeftIcon>
                            <CloseIcon />
                          </TagLeftIcon>
                          <TagLabel>{tag.name}</TagLabel>
                        </Tag>
                      </Button>
                    ))}
                  </Flex>
                </FormControl>
              </TabPanel>

              <TabPanel>
                <Editor
                  height={'500px'}
                  language={'json'}
                  value={flow}
                  onChange={(value) => setFlow(value)}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>

        <ModalFooter>
          <Button
            type="submit"
            isLoading={loading}
            loadingText="Creating"
            colorScheme="blue"
            onClick={createFlow}
            isDisabled={currentTab === 0 ? !canCreateCustom : false}
          >
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateFlowModal;
