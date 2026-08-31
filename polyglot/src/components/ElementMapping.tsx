import { PolyglotNode } from '@/types/PolyglotNode';
import { PolyglotEdge } from '@/types/PolyglotEdge';
import { NodeProps, EdgeProps } from 'reactflow';
import { NODE_TYPE } from '@/types/NodeType';
import { EDGE_TYPE } from '@/types/EdgeType';

import { PolyglotNodePropertiesProps, PolyglotEdgePropertiesProps } from '@/types/ElementMappingTypes';
import { PolyglotComponentMapping } from './PolyglotComponentMapping';

// --- Node Config Imports ---
import { trueFalseNodeConfig } from '@/components/nodes/TrueFalse';
import { emotionAttributionExerciseANodeConfig } from './nodes/EmotionAttributionExerciseA';
import { emotionAttributionExerciseBNodeConfig } from './nodes/EmotionAttributionExerciseB';
import { emotionAttributionNodeConfig } from './nodes/EmotionAttribution';
import { eyesTaskNodeConfig } from './nodes/EyesTask';
import { fauxPasNodeConfig } from './nodes/FauxPas';
import { socialSituationsNodeConfig } from './nodes/SocialSituations';
import { theoryOfMindNodeConfig } from './nodes/TheoryOfMind';
import { containerNodeConfig } from './nodes/Container';
import { emotionRecognitionExerciseANodeConfig } from './nodes/EmotionRecognitionExerciseA';
import { socialSituationsExerciseANodeConfig } from './nodes/SocialSituationsExerciseA';

// --- Edge Config Imports ---
import { unconditionalEdgeConfig } from './edges/UnconditionalEdge';
import { conditionalEdgeConfig } from './edges/ConditionalEdge';
import { passFailEdgeConfig } from './edges/PassFailEdge';
import { fauxPasExerciseANodeConfig } from './nodes/FauxPasExerciseA';
import { theoryOfMindExerciseANodeConfig } from './nodes/TheoryOfMindExerciseA';

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
  emotionAttributionExerciseANodeConfig,
  emotionAttributionExerciseBNodeConfig,
  emotionAttributionNodeConfig,
  eyesTaskNodeConfig,
  fauxPasNodeConfig,
  fauxPasExerciseANodeConfig,
  socialSituationsNodeConfig,
  theoryOfMindNodeConfig,
  theoryOfMindExerciseANodeConfig,
  containerNodeConfig,
  emotionRecognitionExerciseANodeConfig,
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
  [NODE_TYPE.EMOTION_ATTRIBUTION_EXERCISE_A]: emotionAttributionExerciseANodeConfig.elementComponent,
  [NODE_TYPE.EMOTION_ATTRIBUTION_EXERCISE_B]: emotionAttributionExerciseBNodeConfig.elementComponent,
  [NODE_TYPE.EMOTION_ATTRIBUTION]: emotionAttributionNodeConfig.elementComponent,
  [NODE_TYPE.EYES_TASK]: eyesTaskNodeConfig.elementComponent,
  [NODE_TYPE.FAUX_PAS]: fauxPasNodeConfig.elementComponent,
  [NODE_TYPE.FAUX_PAS_EXERCISE_A]: fauxPasExerciseANodeConfig.elementComponent,
  [NODE_TYPE.SOCIAL_SITUATIONS]: socialSituationsNodeConfig.elementComponent,
  [NODE_TYPE.THEORY_OF_MIND]: theoryOfMindNodeConfig.elementComponent,
  [NODE_TYPE.THEORY_OF_MIND_EXERCISE_A]: theoryOfMindExerciseANodeConfig.elementComponent,
  [NODE_TYPE.CONTAINER]: containerNodeConfig.elementComponent,
  [NODE_TYPE.EMOTION_RECOGNITION_EXERCISE_A]: emotionRecognitionExerciseANodeConfig.elementComponent,
  [NODE_TYPE.SOCIAL_SITUATIONS_EXERCISE_A]: socialSituationsExerciseANodeConfig.elementComponent,
};

export const edgeTypes = {
  [EDGE_TYPE.UNCONDITIONAL]: unconditionalEdgeConfig.elementComponent,
  [EDGE_TYPE.CONDITIONAL]: conditionalEdgeConfig.elementComponent,
  [EDGE_TYPE.PASS_FAIL]: passFailEdgeConfig.elementComponent,
};