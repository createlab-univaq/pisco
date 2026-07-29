import TextField from '../../Forms/Fields/TextField';
import NodeProperties from './NodeProperties';

const WatchVideoNodeProperties = () => {
  return (
    <>
      <NodeProperties
        platform={['WebApp']}
        activityDescription="In this activity learners will be given a link to watch"
      />
      <TextField label="URL" name="data.link" />
    </>
  );
};

export default WatchVideoNodeProperties;
