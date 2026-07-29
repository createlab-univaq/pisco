import AnswerExplanationListField from '../../Forms/Fields/AnswerExplanationListField';
import TextField from '../../Forms/Fields/TextField';

type Props = {
  basePath: string;
  isDisabled?: boolean;
};

const path = (basePath: string, field: string) => `${basePath}.${field}`;

const SocialSituationExerciseAEmbedded = ({ basePath, isDisabled }: Props) => {
  return (
    <>
      <TextField
        label="Scenario"
        name={path(basePath, 'scenario')}
        isTextArea
        isDisabled={isDisabled}
      />

      <AnswerExplanationListField
        label="Risposte (con spiegazione)"
        name={path(basePath, 'items')}
        correctIndexName={path(basePath, 'correctIndex')}
        isDisabled={isDisabled}
      />
    </>
  );
};

export default SocialSituationExerciseAEmbedded;
