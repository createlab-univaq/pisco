// 1. Import the base interface
import { PolyglotNodeBase } from './PolyglotNodeBase';

// 2. Import all your individual feature-driven node types
// (Ensure the folder paths match your actual structure)
import { EmotionAttributionANode } from '@/components/nodes/EmotionAttributionA';
import { EmotionAttributionBNode } from '@/components/nodes/EmotionAttributionB';
import { EmotionAttributionTestNode } from '@/components/nodes/EmotionAttribution';
import { EyesTaskNode } from '@/components/nodes/EyesTask';
import { FauxPasNode } from '@/components/nodes/FauxPas';
import { SocialSituationsNode } from '@/components/nodes/SocialSituations';
import { TheoryOfMindNode } from '@/components/nodes/TheoryOfMind';
import { TrueFalseNode } from '@/components/nodes/TrueFalse';
import { ContainerNode } from '@/components/nodes/Container';
// ... import any other nodes as you build them

// 3. Define the Master Discriminated Union
// This is the core of the pattern. Because every node has a specific string literal 
// for its 'type' property, TypeScript can discriminate between them intelligently.
export type PolyglotNode =
    | EmotionAttributionANode
    | EmotionAttributionBNode
    | EmotionAttributionTestNode
    | EyesTaskNode
    | FauxPasNode
    | SocialSituationsNode
    | TheoryOfMindNode
    | TrueFalseNode
    | ContainerNode;

// 4. Extract the allowed types for utility 
// This automatically creates a strict union of strings: 
// 'EmotionAttributionANode' | 'EmotionAttributionBNode' | 'EyesTaskTestNode' | ...
export type PolyglotNodeType = PolyglotNode['type'];

// 5. Base exports 
export * from './PolyglotNodeBase';
// export * from './NodeType'; (if you need to export the enum/constants)
// export type PolyglotEdge = ...
// export type PolyglotFlow = ...