import { Button, SkeletonText, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import TextField from '../../Forms/Fields/TextField';
import TrueFalseField from '../../Forms/Fields/TrueFalseField';
import NodeProperties from './NodeProperties';

const TrueFalseNodeProperties = () => {
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
        activityDescription="In this activity learners will have to provide answers to true and false
        questions"
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
      <TextField label="Instructions" name="data.instructions" isTextArea />
      <span style={{ float: 'right' }}>
        <TextField
          label="Negative Points"
          name="data.negativePoints"
          width="200px"
        />
      </span>
      <TextField
        label="Positive Points"
        name="data.positivePoints"
        width="200px"
      />
      <SkeletonText
        paddingTop={'5px'}
        noOfLines={2}
        spacing="4"
        skeletonHeight="5"
        isLoaded={!generatingLoading}
      >
        <TrueFalseField
          label="Questions"
          name="data.questions"
          option="Question"
        />
      </SkeletonText>
    </>
  );
};

export default TrueFalseNodeProperties;
