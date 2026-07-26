import LessonTextNodeProperties from '../../../components/Properties/Nodes/LessonTextNodeProperties';
import { ReactFlowLessonNode } from '../../../components/ReactFlowNode';
import icon from '../../../public/lesson_icon.png';
import { polyglotNodeComponentMapping } from '../elementMapping';
import { defaultPolyglotNodeData, NodeData, PolyglotNode } from './Node';

export type LessonTextNodeData = NodeData & {
  text: string;
};

export type LessonTextNode = PolyglotNode & {
  type: 'lessonTextNode';
  data: LessonTextNodeData;
};

polyglotNodeComponentMapping.registerMapping<LessonTextNode>({
  elementType: 'lessonTextNode',
  name: 'Lesson (Text)',
  icon: icon.src,
  group: ' ',
  platform: 'WebApp',
  propertiesComponent: LessonTextNodeProperties,
  elementComponent: ReactFlowLessonNode,
  defaultData: {
    text: '',
    ...defaultPolyglotNodeData,
  },
});
