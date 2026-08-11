import type { ValidationError } from './generic';
import { validateGenericStrict } from './generic';

import { allowedEmptyFields, typeSpecificChecks } from './config';

import { makeValidateContainerNode } from './nodes/ContainerNode';
import { validateFauxPasNode } from './nodes/FauxPasNode';
import { validateSocialSituationsNode } from './nodes/SocialSituationsNode';

export type NodeValidator = (data: any) => ValidationError[];

export const nodeValidators: Record<string, NodeValidator> = {
    socialSituationsNode: validateSocialSituationsNode,
    FauxPasNode: validateFauxPasNode,
    // ContainerNode is injected below to avoid circular dependencies
};

export const validateNodeData = (
    type: string,
    data: any
): { ok: boolean; errors: ValidationError[] } => {
    const errors: ValidationError[] = [];

    // 1) Strict generic (root data keys)
    errors.push(...validateGenericStrict(type, data, allowedEmptyFields));

    // 2) Your legacy specific checks
    if (typeSpecificChecks[type] && !typeSpecificChecks[type](data)) {
        errors.push({
            label: type,
            message: 'Specific rules for this node were not met.',
        });
    }

    // 3) Specific validator (if it exists)
    const v = nodeValidators[type];
    if (v) errors.push(...v(data));

    return { ok: errors.length === 0, errors };
};

// ContainerNode: Validates children recursively
nodeValidators.ContainerNode = makeValidateContainerNode(
    (childType, childData) => validateNodeData(childType, childData)
); 