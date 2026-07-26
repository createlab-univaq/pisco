import MultiFieldArray from '../../Forms/Fields/MultiArrayField';
import TextField from '../../Forms/Fields/TextField';
import NodeProperties from './NodeProperties';

const CircuitNodeProperties = () => {
  return (
    <>
      <NodeProperties
        platform={['Arduino']}
        activityDescription="In this activity learners will follow the instruction and his knowledge to create a circuit"
      />
      <TextField label="Instructions" name="data.instructions" isTextArea />
      <MultiFieldArray
        label="List of Pins"
        name="data.pinsList"
        fieldsConfig={[
          { name: 'pin', placeholder: 'Pins' },
          { name: 'value', placeholder: 'Value' },
        ]}
      />
    </>
  );
};

export default CircuitNodeProperties;
