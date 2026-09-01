import { validateContainerNode } from '@/components/nodes/Container/validate';
import { NODE_TYPE } from '@/types/NodeType';
import { ValidationError } from '@/types/ValidationError';
import { validateEmotionAttributionNode } from '@/components/nodes/EmotionAttribution/validate';
import { validateEmotionAttributionExerciseANode } from '@/components/nodes/EmotionAttributionExerciseA/validate';
import { validateEmotionAttributionExerciseBNode } from '@/components/nodes/EmotionAttributionExerciseB/validate';
import { validateEmotionRecognitionExerciseANode } from '@/components/nodes/EmotionRecognitionExerciseA/validate';
import { validateEyesTaskNode } from '@/components/nodes/EyesTask/validate';
import { validateFauxPasNode } from '@/components/nodes/FauxPas/validate';
import { validateFauxPasExerciseANode } from '@/components/nodes/FauxPasExerciseA/validate';
import { validateSocialSituationsNode } from '@/components/nodes/SocialSituations/validate';
import { validateSocialSituationsExerciseANode } from '@/components/nodes/SocialSituationsExerciseA/validate';
import { validateTheoryOfMindNode } from '@/components/nodes/TheoryOfMind/validate';
import { validateTheoryOfMindExerciseANode } from '@/components/nodes/TheoryOfMindExerciseA/validate';
import { validateTrueFalseNode } from '@/components/nodes/TrueFalse/validate';

export type NodeValidator = (data: any) => ValidationError[];

export const nodeValidators: Record<string, NodeValidator> = {
    [NODE_TYPE.EMOTION_ATTRIBUTION]: validateEmotionAttributionNode,
    [NODE_TYPE.EMOTION_ATTRIBUTION_EXERCISE_A]: validateEmotionAttributionExerciseANode,
    [NODE_TYPE.EMOTION_ATTRIBUTION_EXERCISE_B]: validateEmotionAttributionExerciseBNode,
    [NODE_TYPE.EMOTION_RECOGNITION_EXERCISE_A]: validateEmotionRecognitionExerciseANode,
    [NODE_TYPE.EYES_TASK]: validateEyesTaskNode,
    [NODE_TYPE.FAUX_PAS]: validateFauxPasNode,
    [NODE_TYPE.FAUX_PAS_EXERCISE_A]: validateFauxPasExerciseANode,
    [NODE_TYPE.SOCIAL_SITUATIONS]: validateSocialSituationsNode,
    [NODE_TYPE.SOCIAL_SITUATIONS_EXERCISE_A]: validateSocialSituationsExerciseANode,
    [NODE_TYPE.THEORY_OF_MIND]: validateTheoryOfMindNode,
    [NODE_TYPE.THEORY_OF_MIND_EXERCISE_A]: validateTheoryOfMindExerciseANode,
    [NODE_TYPE.TRUE_FALSE]: validateTrueFalseNode,
};

nodeValidators.ContainerNode = validateContainerNode(
    (childType, childData) => validateNodeData(childType, childData)
);

export const validateNodeData = (
    type: string,
    data: any
): { ok: boolean; errors: ValidationError[] } => {
    const validator = nodeValidators[type];
    if (!validator) {
        return { ok: true, errors: [] };
    }

    const errors = validator(data);
    return { ok: errors.length === 0, errors };
};