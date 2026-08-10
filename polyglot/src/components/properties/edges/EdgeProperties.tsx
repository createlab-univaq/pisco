'use client';

import type { ChangeEvent } from 'react';
import TextField from '@/components/forms/TextField';
import EnumField from '@/components/forms/EnumField';
import { polyglotEdgeComponentMapping } from '@/components/ElementMapping';
import styles from './EdgeProperties.module.css';

// Config matrix defining which edges are allowed to exit from which nodes
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
      'BrainstormingNode',
      'UMLModelingNode',
    ],
  },
];

export type EdgePropertiesProps = {
  title?: string;
  type?: string;
  sourceNodeType?: string;
  onChange?: (field: string, value: string) => void;
  errors?: {
    title?: string;
    type?: string;
  };
};

const EdgeProperties = ({
  title = '',
  type = '',
  sourceNodeType = '',
  onChange,
  errors,
}: EdgePropertiesProps) => {
  // Find the allowed edge types based on the passed source node type
  const allowedEdgeTypes =
    config.find((item) => item.nodeTypes.includes(sourceNodeType))
      ?.edgeTypes ?? [];

  const handleChange = (field: string) => (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    onChange?.(field, e.target.value);
  };

  return (
    <div className={styles.container}>
      <TextField
        label="Title"
        name="title"
        value={title}
        isRequired
        onChange={handleChange('title')}
        error={errors?.title}
      />

      <EnumField
        label="Type"
        name="type"
        value={type}
        onChange={handleChange('type')}
        error={errors?.type}
        options={
          <>
            {Object.keys(polyglotEdgeComponentMapping.nameMapping)
              .filter((value) => allowedEdgeTypes.includes(value))
              .map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
          </>
        }
      />
    </div>
  );
};

export default EdgeProperties;