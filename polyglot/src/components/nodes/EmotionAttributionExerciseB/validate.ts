import { validateGenericStrict } from '@/lib/validation/generic';
import { ValidationError } from '@/types/ValidationError';

const isNonEmptyString = (v: unknown) =>
    typeof v === 'string' && v.trim() !== '';

export const validateEmotionAttributionExerciseBNode = (data: any): ValidationError[] => {
    const allowedEmpty = ['explanation'];
    const errors: ValidationError[] = validateGenericStrict('EmotionAttributionExerciseBNode', data, allowedEmpty);

    const items = data?.items;
    if (!Array.isArray(items) || items.length === 0) {
        errors.push({
            label: 'items',
            path: 'data.items',
            message: 'Insert at least one item.',
        });
        return errors;
    }

    items.forEach((item: any, i: number) => {
        if (!isNonEmptyString(item?.qid)) {
            errors.push({
                label: 'qid',
                path: `data.items.${i}.qid`,
                message: 'Missing qid.',
            });
        }

        if (!isNonEmptyString(item?.emotion)) {
            errors.push({
                label: 'emotion',
                path: `data.items.${i}.emotion`,
                message: 'Missing emotion.',
            });
        }

        if (!isNonEmptyString(item?.scenario)) {
            errors.push({
                label: 'scenario',
                path: `data.items.${i}.scenario`,
                message: 'Missing scenario.',
            });
        }
    });

    return errors;
};