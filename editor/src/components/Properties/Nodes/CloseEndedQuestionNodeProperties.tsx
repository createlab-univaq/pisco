import { Button, SkeletonText, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import ArrayField from '../../Forms/Fields/ArrayField';
import MarkDownField from '../../Forms/Fields/MarkDownField';
import NodeProperties from './NodeProperties';

const CloseEndedQuestionNodeProperties = () => {
  const {
    isOpen: isOpenAITool,
    onOpen: onOpenAITool,
    onClose: onCloseAITool,
  } = useDisclosure();
  const [generatingLoading, setGeneratingLoading] = useState(false);
  return (
    <>
      <NodeProperties
        platform={['WebApp']}
        activityDescription="In this activity learners will have to complete a sentence with the
        appropriate word or phrase"
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
        <MarkDownField label="Question" name="data.question" />
      </SkeletonText>
      <SkeletonText
        paddingTop={'5px'}
        noOfLines={2}
        spacing="8"
        skeletonHeight="10"
        isLoaded={!generatingLoading}
      >
        <ArrayField
          label="Correct Answers"
          name="data.correctAnswers"
          option="Answer"
        />
      </SkeletonText>
    </>
  );
};

export default CloseEndedQuestionNodeProperties;
