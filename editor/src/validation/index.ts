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
  // ContainerNode lo settiamo dopo
};

export const validateNodeData = (
  type: string,
  data: any
): { ok: boolean; errors: ValidationError[] } => {
  const errors: ValidationError[] = [];

  // 1) strict generic (root data keys)
  errors.push(...validateGenericStrict(type, data, allowedEmptyFields));

  // 2) tuoi check specifici “legacy”
  if (typeSpecificChecks[type] && !typeSpecificChecks[type](data)) {
    errors.push({
      label: type,
      message: 'Regole specifiche del nodo non soddisfatte.',
    });
  }

  // 3) validator specifico (se esiste)
  const v = nodeValidators[type];
  if (v) errors.push(...v(data));

  return { ok: errors.length === 0, errors };
};

// ContainerNode: valida anche i figli ricorsivamente
nodeValidators.ContainerNode = makeValidateContainerNode(
  (childType, childData) => validateNodeData(childType, childData)
);
