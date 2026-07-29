import EnumField from '../../Forms/Fields/EnumField';
import EdgeProperties from './EdgeProperties';

const PassFailEdgeProperties = () => {
  return (
    <>
      <EdgeProperties />
      <EnumField
        label="Condition Kind"
        name="data.conditionKind"
        options={
          <>
            <option
              value="pass"
              onSelect={() => {
                console.log('onSelect pass');
              }}
            >
              Pass
            </option>
            <option value="fail">Fail</option>
          </>
        }
      />
    </>
  );
};

export default PassFailEdgeProperties;
