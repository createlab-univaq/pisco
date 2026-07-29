import { AddIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';
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
  Tag,
  TagLabel,
  TagLeftIcon,
  Text,
  Textarea,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { PolyglotFlow, PolyglotFlowInfo } from '../../types/polyglotElements';
import { colors } from './CreateFlowModal';

type EditFlowModalProps = {
  isOpen: boolean;
  onClose: () => void;
  flow: PolyglotFlow;
  updateInfo: (flowInfo: PolyglotFlowInfo) => void;
};

const EditFlowModal = ({
  isOpen,
  onClose,
  flow,
  updateInfo,
}: EditFlowModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagName, setTagName] = useState('');
  const [publish, setPublish] = useState(false);
  const [colorTag, setColorTag] = useState(colors[0]);
  const [tags, setTags] = useState([...flow.tags]);

  const { isOpen: ioPop, onClose: ocPop, onOpen: opPop } = useDisclosure();

  useEffect(() => {
    if (!flow) return;
    setTitle(flow.title ?? '');
    setDescription(flow.description ?? '');
    setColorTag(colors[0]);
    setTags([...(flow.tags ?? [])]);
    setPublish(!!flow.publish);
    setTagName('');
  }, [flow]);

  const normalizedTagName = tagName.trim().toUpperCase();

  const addTag = () => {
    if (!normalizedTagName) return;

    setTags((prev) => {
      const exists = prev.some((t) => t.name === normalizedTagName);
      if (exists) return prev;

      return [
        ...prev,
        {
          name: normalizedTagName,
          color: colorTag,
        },
      ];
    });

    setTagName('');
  };

  const removeTagAt = (index: number) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={'2xl'} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Flow</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <FormControl>
            <FormLabel mb={2} fontWeight={'bold'}>
              Title:
            </FormLabel>
            <Input
              placeholder="Insert title..."
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
            />

            <FormLabel mb={2} fontWeight={'bold'}>
              Description:
            </FormLabel>
            <Textarea
              placeholder="Insert description..."
              value={description}
              onChange={(e) => setDescription(e.currentTarget.value)}
            />
          </FormControl>

          <FormLabel my={2} fontWeight={'bold'}>
            Click on the tags to remove them (add using the input below):
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
                <Box zIndex="popover" w="full" h="full" position={'relative'}>
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
        </ModalBody>

        <Box position={'absolute'} bottom={'15px'} left={'27px'}>
          {publish ? 'Published' : 'Not published'}:{' '}
          <IconButton
            backgroundColor={publish ? 'green.500' : 'red.500'}
            onClick={() => setPublish((p) => !p)}
            aria-label="Toggle publish"
          >
            {publish ? <CheckIcon /> : <CloseIcon />}
          </IconButton>
        </Box>

        <ModalFooter>
          <Button
            type="submit"
            loadingText="Updating"
            colorScheme="blue"
            onClick={() => {
              if (!title.trim() || !description.trim()) return;

              updateInfo({
                title: title.trim(),
                description: description.trim(),
                tags,
                publish,
                topicsAI: flow.topicsAI,
              });

              onClose();
            }}
          >
            Update
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditFlowModal;
