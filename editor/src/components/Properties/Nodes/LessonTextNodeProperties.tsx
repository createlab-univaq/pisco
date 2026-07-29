import MarkDownField from '../../Forms/Fields/MarkDownField';
import NodeProperties from './NodeProperties';

const LessonTextNodeProperties = () => {
  return (
    <>
      <NodeProperties
        platform={['WebApp']}
        activityDescription="Insert a text, learners will be able to read the formatted text as in
        the right side."
      />
      <MarkDownField label="Text" name="data.text" />
    </>
  );
};

export default LessonTextNodeProperties;
