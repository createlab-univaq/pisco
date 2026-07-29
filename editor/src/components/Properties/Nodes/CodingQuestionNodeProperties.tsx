import { useState } from 'react';
import CodeField from '../../Forms/Fields/CodeField';
import EnumField from '../../Forms/Fields/EnumField';
import MarkDownField from '../../Forms/Fields/MarkDownField';
import NodeProperties from './NodeProperties';

const CodingQuestionNodeProperties = () => {
  const [language, setLanguage] = useState('csharp');
  return (
    <>
      <NodeProperties
        platform={['CodingWebApp']}
        activityDescription="In this activity learners will have to complete a coding exercise"
      />
      <MarkDownField label="Question" name="data.question" />
      <CodeField
        label="Template code"
        name="data.codeTemplate"
        language={language}
      />
      <EnumField
        label="Language"
        name="data.language"
        constraints={{ onChange: (event) => setLanguage(event.target.value) }}
        options={
          <>
            <option value="javascript">javascript</option>
            <option value="html">html</option>
          </>
        }
      />
    </>
  );
};

export default CodingQuestionNodeProperties;
