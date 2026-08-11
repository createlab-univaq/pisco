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
                    message: 'Insert at least one section in the container.',
                });
                return errors;
            }

            sections.forEach((sec: any, s: number) => {
                const items = sec?.items;
                if (!Array.isArray(items)) {
                    errors.push({
                        label: 'items',
                        path: `data.sections.${s}.items`,
                        message: 'items must be an array.',
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
                            message: 'Missing item type.',
                        });
                        return;
                    }

                    const childRes = validateChild(itemType, itemData);
                    if (!childRes.ok) {
                        const childLabel = item?.title || itemType;
                        errors.push({
                            label: 'child',
                            path: `data.sections.${s}.items.${i}`,
                            message: `Invalid item: ${childLabel}`,
                        });
                    }
                });
            });

            return errors;
        };