import type { ValidationError } from '../generic';

const isNonEmptyString = (v: unknown) =>
    typeof v === 'string' && v.trim() !== '';

const isFiniteNumber = (v: unknown) =>
    typeof v === 'number' && Number.isFinite(v);

const isValidAnswer = (a: any) =>
    a && isNonEmptyString(a.text) && isFiniteNumber(a.score);

export const validateSocialSituationsNode = (data: any): ValidationError[] => {
    const errors: ValidationError[] = [];

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
                !answers.every(isValidAnswer)
            ) {
                errors.push({
                    label: 'answers',
                    path: `data.items.${i}.sections.${j}.answers`,
                    message: 'Insert at least one answer (non-empty text + numeric score).',
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
                // If you want to force at least one correct answer, keep this; otherwise remove it
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