import { useFormContext } from 'react-hook-form';
import useStore from '../../../store';
import { polyglotEdgeComponentMapping } from '../../../types/polyglotElements';
import EnumField from '../../Forms/Fields/EnumField';
import TextField from '../../Forms/Fields/TextField';

const config = [
  {
    edgeTypes: ['unconditionalEdge', 'manuallyProgressEdge'],
    nodeTypes: [
      'lessonTextNode',
      'WatchVideoNode',
      'MindMapNode',
      'SummaryNode',
      'ScanningNode',
      'ProblemSolvingNode',
      'FindSolutionNode',
      'CreateKeywordsListNode',
      'MemoriseKeywordsListNode',
      'PromptEngineeringNode',
      'ProblemSolvingNode',
    ],
  },
  {
    edgeTypes: ['manuallyProgressEdge', 'passFailEdge'],
    nodeTypes: ['CollaborativeModelingNode'],
  },
  {
    edgeTypes: [
      'customValidationEdge',
      'exactValueEdge',
      'passFailEdge',
      'failDebtEdge',
      'manuallyProgressEdge',
    ],
    nodeTypes: [
      'multipleChoiceQuestionNode',
      'codingQuestionNode',
      'closeEndedQuestionNode',
      'abstractNode',
      'TrueFalseNode',
      'ImageEvaluationNode',
      'CasesEvaluationNode',
      'InnovationPitchNode',
      'OpenQuestionNode',
      'FlowChartNode',
      'AnalyzingPlottingDataNode',
      'CalculationNode',
      'SimulationNode',
      'InnovationPitchNode',
      'BrainstormingNode',
      'UMLModelingNode',
    ],
  },
];

export type EdgePropertiesProps = {};
const EdgeProperties = () => {
  const { getValues } = useFormContext();
  const source: string = getValues('reactFlow.source');

  const { nodeMap } = useStore();

  const node = nodeMap.get(source);

  const edgesTypes =
    config.find((item) => item.nodeTypes.includes(node?.type ?? ''))
      ?.edgeTypes ?? [];

  return (
    <>
      <TextField
        label="Title"
        name="title"
        constraints={{
          required: 'Title is required',
        }}
      />
      <EnumField
        label="Type"
        name="type"
        options={
          <>
            {Object.keys(polyglotEdgeComponentMapping.nameMapping)
              .filter((value) => edgesTypes.includes(value))
              .map((value, index) => (
                <option key={index} value={value} selected>
                  {value}
                </option>
              ))}
          </>
        }
      />
    </>
  );
};

export default EdgeProperties;
