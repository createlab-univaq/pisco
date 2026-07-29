import { CloseButton, Flex } from '@chakra-ui/react';
import EnumField from '../../Forms/Fields/EnumField';
import TextField from '../../Forms/Fields/TextField';

export type NodePropertiesProps = {
  platform?: string[];
  activityDescription?: string;
};

const NodeProperties = ({
  platform,
  activityDescription,
}: NodePropertiesProps) => {
  if (!platform) platform = [''];
  const option: JSX.Element = (
    <>
      {platform.map((p) => (
        // eslint-disable-next-line react/jsx-key
        <option value={p} defaultChecked>
          {p}
        </option>
      ))}
    </>
  );
  return (
    <>
      <div>
        <b>Activity description</b>
        <br />
        {activityDescription}
      </div>
      <br />
      <TextField
        label="Title"
        name="title"
        constraints={{
          required: 'Title is required',
        }}
      />
      <TextField label="Description" name="description" isTextArea />
      <Flex>
        <EnumField
          label="Difficulty"
          name="difficulty"
          width="50%"
          constraints={{ valueAsNumber: true }}
          hidden={true}
          options={
            <>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </>
          }
        />
        <EnumField
          label="Platform"
          name="platform"
          width="50%"
          options={option}
        />
      </Flex>
    </>
  );
};

export default NodeProperties;
