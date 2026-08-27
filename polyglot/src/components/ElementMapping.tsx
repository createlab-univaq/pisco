import { PolyglotNode } from '@/types/polyglot-elements/PolyglotNode';
import { PolyglotEdge } from '@/types/polyglot-elements/PolyglotEdge';
import { NodeProps, EdgeProps } from 'reactflow';

import { PolyglotNodePropertiesProps, PolyglotEdgePropertiesProps } from '@/types/polyglot-elements/ElementMappingTypes';
import { PolyglotComponentMapping } from './PolyglotComponentMapping';

// INSTANTIATE THE SINGLETONS
export const polyglotNodeComponentMapping = new PolyglotComponentMapping<
  PolyglotNodePropertiesProps,
  NodeProps,
  PolyglotNode
>();

export const polyglotEdgeComponentMapping = new PolyglotComponentMapping<
  PolyglotEdgePropertiesProps,
  EdgeProps,
  PolyglotEdge
>();

// --- Node Imports ---
import { trueFalseNodeConfig } from '@/components/nodes/TrueFalse';
import { emotionAttributionANodeConfig } from './nodes/EmotionAttributionA';
import { emotionAttributionBNodeConfig } from './nodes/EmotionAttributionB';
import { emotionAttributionNodeConfig } from './nodes/EmotionAttribution';
import { eyesTaskNodeConfig } from './nodes/EyesTask';
import { fauxPasNodeConfig } from './nodes/FauxPas';
import { socialSituationsNodeConfig } from './nodes/SocialSituations';
import { theoryOfMindNodeConfig } from './nodes/TheoryOfMind';
import { containerNodeConfig } from './nodes/Container';
import { emotionRecognitionNodeConfig } from './nodes/EmotionRecognition';
import { socialSituationsExerciseANodeConfig } from './nodes/SocialSituationsExerciseA';

// --- Edge Imports ---
import { unconditionalEdgeConfig } from './edges/UnconditionalEdge';
import { conditionalEdgeConfig } from './edges/ConditionalEdge';
import { passFailEdgeConfig } from './edges/PassFailEdge';

// REGISTER ELEMENTS
polyglotNodeComponentMapping.registerMany([
  trueFalseNodeConfig,
  emotionAttributionANodeConfig,
  emotionAttributionBNodeConfig,
  emotionAttributionNodeConfig,
  eyesTaskNodeConfig,
  fauxPasNodeConfig,
  socialSituationsNodeConfig,
  theoryOfMindNodeConfig,
  containerNodeConfig,
  emotionRecognitionNodeConfig,
  socialSituationsExerciseANodeConfig,
]);

polyglotEdgeComponentMapping.registerMany([
  unconditionalEdgeConfig,
  conditionalEdgeConfig,
  passFailEdgeConfig,
]);