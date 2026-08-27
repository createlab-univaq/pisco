import { PolyglotNode } from '@/types/polyglot-elements/PolyglotNode';
import { PolyglotEdge } from '@/types/polyglot-elements/PolyglotEdge';
import { NodeProps, EdgeProps } from 'reactflow';
import { NODE_TYPE } from '@/types/polyglot-elements/NodeType';
import { EDGE_TYPE } from '@/types/polyglot-elements/EdgeType';

import { PolyglotNodePropertiesProps, PolyglotEdgePropertiesProps } from '@/types/polyglot-elements/ElementMappingTypes';
import { PolyglotComponentMapping } from './PolyglotComponentMapping';

// --- Node Config Imports ---
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

// --- Edge Config Imports ---
import { unconditionalEdgeConfig } from './edges/UnconditionalEdge';
import { conditionalEdgeConfig } from './edges/ConditionalEdge';
import { passFailEdgeConfig } from './edges/PassFailEdge';
import { fauxPasExerciseANodeConfig } from './nodes/FauxPasExerciseA';

// 1. METADATA REGISTRY (For sidebars, icons, and validation)
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

polyglotNodeComponentMapping.registerMany([
  trueFalseNodeConfig,
  emotionAttributionANodeConfig,
  emotionAttributionBNodeConfig,
  emotionAttributionNodeConfig,
  eyesTaskNodeConfig,
  fauxPasNodeConfig,
  fauxPasExerciseANodeConfig,
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

// REACT FLOW PERFORMANCE DICTIONARIES
// Pure static object literals. No class instances, no dynamic mutations.
export const nodeTypes = {
  [NODE_TYPE.TRUE_FALSE]: trueFalseNodeConfig.elementComponent,
  [NODE_TYPE.EMOTION_ATTRIBUTION_A]: emotionAttributionANodeConfig.elementComponent,
  [NODE_TYPE.EMOTION_ATTRIBUTION_B]: emotionAttributionBNodeConfig.elementComponent,
  [NODE_TYPE.EMOTION_ATTRIBUTION]: emotionAttributionNodeConfig.elementComponent,
  [NODE_TYPE.EYES_TASK]: eyesTaskNodeConfig.elementComponent,
  [NODE_TYPE.FAUX_PAS]: fauxPasNodeConfig.elementComponent,
  [NODE_TYPE.FAUX_PAS_EXERCISE_A]: fauxPasExerciseANodeConfig.elementComponent,
  [NODE_TYPE.SOCIAL_SITUATIONS]: socialSituationsNodeConfig.elementComponent,
  [NODE_TYPE.THEORY_OF_MIND]: theoryOfMindNodeConfig.elementComponent,
  [NODE_TYPE.CONTAINER]: containerNodeConfig.elementComponent,
  [NODE_TYPE.EMOTION_RECOGNITION]: emotionRecognitionNodeConfig.elementComponent,
  [NODE_TYPE.SOCIAL_SITUATIONS_EXERCISE_A]: socialSituationsExerciseANodeConfig.elementComponent,
};

export const edgeTypes = {
  [EDGE_TYPE.UNCONDITIONAL]: unconditionalEdgeConfig.elementComponent,
  [EDGE_TYPE.CONDITIONAL]: conditionalEdgeConfig.elementComponent,
  [EDGE_TYPE.PASS_FAIL]: passFailEdgeConfig.elementComponent,
};