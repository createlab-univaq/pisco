import WatchVideoNodeProperties from '../../../components/Properties/Nodes/WatchVideoNodeProperties';
import { ReactFlowWatchVideoNode } from '../../../components/ReactFlowNode';
import icon from '../../../public/watchVideo_icon.png';
import { polyglotNodeComponentMapping } from '../elementMapping';
import { defaultPolyglotNodeData, NodeData, PolyglotNode } from './Node';

export type WatchVideoNodeData = NodeData & {
  link: string;
};

export type WatchVideoNode = PolyglotNode & {
  type: 'WatchVideoNode';
  data: WatchVideoNodeData;
};

polyglotNodeComponentMapping.registerMapping<WatchVideoNode>({
  elementType: 'WatchVideoNode',
  name: 'Watch Video',
  icon: icon.src,
  group: 'remember_learning',
  platform: 'WebApp',
  propertiesComponent: WatchVideoNodeProperties,
  elementComponent: ReactFlowWatchVideoNode,
  defaultData: {
    link: '',
    ...defaultPolyglotNodeData,
  },
});
