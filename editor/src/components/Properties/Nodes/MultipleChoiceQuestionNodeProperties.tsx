import { Button, SkeletonText, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import MultipleChoiceField from '../../Forms/Fields/MultipleChoiceField';
import TextField from '../../Forms/Fields/TextField';
import NodeProperties from './NodeProperties';

const MultipleChoiceQuestionNodeProperties = () => {
  const {
    isOpen: isOpenAITool,
    onOpen: onOpenAITool,
    onClose: onCloseAITool,
  } = useDisclosure();

  const [generatingLoading, setGeneratingLoading] = useState(false);
  // todo: unregister the paramete
  return (
    <>
      <NodeProperties
        platform={['WebApp', 'VSCode']}
        activityDescription="In this activity learners will have to select the correct answer from
        multiple options provided"
      />

      <Button
        marginBottom={'5px'}
        id="buttonAI"
        onClick={() => {
          setGeneratingLoading(true);
          onOpenAITool();
        }}
      >
        Create with AI
      </Button>
      <SkeletonText
        noOfLines={4}
        spacing="4"
        skeletonHeight="2"
        isLoaded={!generatingLoading}
      >
        <TextField label="Question" name="data.question" isTextArea />
      </SkeletonText>
      <SkeletonText
        paddingTop={'5px'}
        noOfLines={5}
        spacing="8"
        skeletonHeight="10"
        isLoaded={!generatingLoading}
      >
        <MultipleChoiceField
          label="Choices"
          name="data.choices"
          option="Answer"
        />
      </SkeletonText>
    </>
  );
};

export default MultipleChoiceQuestionNodeProperties;
