import { validateGenericStrict } from '@/lib/validation/generic';
import { ValidationError } from '@/types/ValidationError';

const isNonEmptyString = (v: unknown) =>
    typeof v === 'string' && v.trim() !== '';

export const validateSocialSituationsExerciseANode = (data: any): ValidationError[] => {
    const allowedEmpty = ['explanation'];
    const errors: ValidationError[] = validateGenericStrict('SocialSituationsExerciseANode', data, allowedEmpty);

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
        if (!isNonEmptyString(item?.sid)) {
            errors.push({
                label: 'sid',
                path: `data.items.${i}.sid`,
                message: 'Missing sid.',
            });
        }

        const sections = item?.sections;
        if (!Array.isArray(sections) || sections.length === 0) {
            errors.push({
                label: 'sections',
                path: `data.items.${i}.sections`,
                message: 'Insert at least one section.',
            });
            return;
        }

        sections.forEach((s: any, j: number) => {
            const before = (s?.before ?? '').trim();
            const bold = (s?.bold ?? '').trim();
            const after = (s?.after ?? '').trim();

            if (before === '' && bold === '' && after === '') {
                errors.push({
                    label: 'section text',
                    path: `data.items.${i}.sections.${j}`,
                    message: 'At least one of before/bold/after must be provided.',
                });
            }

            const answers = s?.answers;
            if (
                !Array.isArray(answers) ||
                answers.length === 0 ||
                !answers.every((a: any) => isNonEmptyString(a?.text))
            ) {
                errors.push({
                    label: 'answers',
                    path: `data.items.${i}.sections.${j}.answers`,
                    message: 'Insert at least one answer with non-empty text.',
                });
            }

            const correctIndex = s?.correctIndex;
            if (!Number.isInteger(correctIndex)) {
                errors.push({
                    label: 'correctIndex',
                    path: `data.items.${i}.sections.${j}.correctIndex`,
                    message: 'Select a correct answer index.',
                });
            } else if (Array.isArray(answers) && answers.length > 0) {
                if (correctIndex < 0 || correctIndex >= answers.length) {
                    errors.push({
                        label: 'correctIndex',
                        path: `data.items.${i}.sections.${j}.correctIndex`,
                        message: 'correctIndex is out of bounds for the given answers.',
                    });
                }
            }
        });
    });

    return errors;
};