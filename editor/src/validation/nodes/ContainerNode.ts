// src/validation/nodes/containerNode.ts
import type { ValidationError } from '../generic';

export type ValidateChildFn = (
  type: string,
  data: any
) => { ok: boolean; errors: ValidationError[] };

export const makeValidateContainerNode =
  (validateChild: ValidateChildFn) =>
  (data: any): ValidationError[] => {
    const errors: ValidationError[] = [];

    const sections = data?.sections;
    if (!Array.isArray(sections) || sections.length === 0) {
      errors.push({
        label: 'sections',
        path: 'data.sections',
        message: 'Inserisci almeno una sezione nel container.',
      });
      return errors;
    }

    sections.forEach((sec: any, s: number) => {
      const items = sec?.items;
      if (!Array.isArray(items)) {
        errors.push({
          label: 'items',
          path: `data.sections.${s}.items`,
          message: 'items deve essere un array.',
        });
        return;
      }

      items.forEach((item: any, i: number) => {
        const itemType = item?.type;
        const itemData = item?.data;

        if (!itemType) {
          errors.push({
            label: 'item.type',
            path: `data.sections.${s}.items.${i}.type`,
            message: 'Tipo item mancante.',
          });
          return;
        }

        const childRes = validateChild(itemType, itemData);
        if (!childRes.ok) {
          const childLabel = item?.title || itemType;
          errors.push({
            label: 'child',
            path: `data.sections.${s}.items.${i}`,
            message: `Item non valido: ${childLabel}`,
          });
        }
      });
    });

    return errors;
  };
