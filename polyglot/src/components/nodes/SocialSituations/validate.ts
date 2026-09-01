import { validateGenericStrict } from '@/lib/validation/generic';
import { ValidationError } from '@/types/ValidationError';

const isNonEmptyString = (v: unknown) =>
    typeof v === 'string' && v.trim() !== '';

export const validateSocialSituationsNode = (data: any): ValidationError[] => {
    const allowedEmpty: string[] = [];
    const errors: ValidationError[] = validateGenericStrict('SocialSituationsNode', data, allowedEmpty);

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
            // Individual validations for the text fields so red borders trigger correctly!
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
            if (
                !Array.isArray(answers) ||
                answers.length === 0 ||
                !answers.every(isNonEmptyString)
            ) {
                errors.push({
                    label: 'answers',
                    path: `data.items.${i}.sections.${j}.answers`,
                    message: 'Insert at least one non-empty answer.',
                });
            }

            const correctIndexes = s?.correctIndexes;
            if (!Array.isArray(correctIndexes)) {
                errors.push({
                    label: 'correctIndexes',
                    path: `data.items.${i}.sections.${j}.correctIndexes`,
                    message: 'correctIndexes must be an array.',
                });
            } else {
                if (correctIndexes.length === 0) {
                    errors.push({
                        label: 'correctIndexes',
                        path: `data.items.${i}.sections.${j}.correctIndexes`,
                        message: 'Select at least one correct answer.',
                    });
                }

                if (Array.isArray(answers) && answers.length > 0) {
                    const seen = new Set<number>();
                    correctIndexes.forEach((idx: any) => {
                        if (!Number.isInteger(idx) || idx < 0 || idx >= answers.length) {
                            errors.push({
                                label: 'correctIndexes',
                                path: `data.items.${i}.sections.${j}.correctIndexes`,
                                message: 'Contains invalid indices.',
                            });
                        } else if (seen.has(idx)) {
                            errors.push({
                                label: 'correctIndexes',
                                path: `data.items.${i}.sections.${j}.correctIndexes`,
                                message: 'Contains duplicate indices.',
                            });
                        }
                        seen.add(idx);
                    });
                }
            }
        });
    });

    return errors;
};