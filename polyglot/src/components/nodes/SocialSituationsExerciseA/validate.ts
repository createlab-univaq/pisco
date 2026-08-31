import { validateGenericStrict } from '@/lib/validation/generic';
import { ValidationError } from '@/types/ValidationError';

const isNonEmptyString = (v: unknown) =>
    typeof v === 'string' && v.trim() !== '';

export const validateSocialSituationsExerciseANode = (data: any): ValidationError[] => {
    const allowedEmpty: string[] = [];
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
            if (!isNonEmptyString(s?.before)) {
                errors.push({
                    label: 'before',
                    path: `data.items.${i}.sections.${j}.before`,
                    message: 'Testo iniziale cannot be empty.',
                });
            }

            if (!isNonEmptyString(s?.bold)) {
                errors.push({
                    label: 'bold',
                    path: `data.items.${i}.sections.${j}.bold`,
                    message: 'Parte in grassetto cannot be empty.',
                });
            }

            if (!isNonEmptyString(s?.after)) {
                errors.push({
                    label: 'after',
                    path: `data.items.${i}.sections.${j}.after`,
                    message: 'Testo finale cannot be empty.',
                });
            }

            const answers = s?.answers;
            if (!Array.isArray(answers) || answers.length !== 4) {
                errors.push({
                    label: 'answers',
                    path: `data.items.${i}.sections.${j}.answers`,
                    message: 'Must provide exactly 4 answers.',
                });
            } else {
                answers.forEach((ans: any, ansIdx: number) => {
                    if (!isNonEmptyString(ans?.text)) {
                        errors.push({
                            label: 'answer text',
                            path: `data.items.${i}.sections.${j}.answers.${ansIdx}.text`,
                            message: `Answer ${ansIdx + 1} text cannot be empty.`,
                        });
                    }
                    if (!isNonEmptyString(ans?.explanation)) {
                        errors.push({
                            label: 'answer explanation',
                            path: `data.items.${i}.sections.${j}.answers.${ansIdx}.explanation`,
                            message: `Answer ${ansIdx + 1} explanation cannot be empty.`,
                        });
                    }
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