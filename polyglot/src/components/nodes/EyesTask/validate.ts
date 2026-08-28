import { validateGenericStrict } from '@/lib/validation/generic';
import { ValidationError } from '@/types/ValidationError';

const isNonEmptyString = (v: unknown) =>
    typeof v === 'string' && v.trim() !== '';

export const validateEyesTaskNode = (data: any): ValidationError[] => {
    const allowedEmpty = ['imageId', 'minCorrectToPass'];
    const errors: ValidationError[] = validateGenericStrict('EyesTaskNode', data, allowedEmpty);

    const questions = data?.questions;
    if (!Array.isArray(questions) || questions.length === 0) {
        errors.push({
            label: 'questions',
            path: 'data.questions',
            message: 'Insert at least one question.',
        });
        return errors;
    }

    questions.forEach((q: any, qi: number) => {
        if (!isNonEmptyString(q?.qid)) {
            errors.push({
                label: 'qid',
                path: `data.questions.${qi}.qid`,
                message: 'Missing qid.',
            });
        }

        const answers = q?.answers;
        if (
            !Array.isArray(answers) ||
            answers.length === 0 ||
            !answers.every(isNonEmptyString)
        ) {
            errors.push({
                label: 'answers',
                path: `data.questions.${qi}.answers`,
                message: 'Insert at least one non-empty answer.',
            });
        }

        const correctIndex = q?.correctIndex;
        if (!Number.isInteger(correctIndex)) {
            errors.push({
                label: 'correctIndex',
                path: `data.questions.${qi}.correctIndex`,
                message: 'Select a correct answer index.',
            });
        } else if (Array.isArray(answers) && answers.length > 0) {
            if (correctIndex < 0 || correctIndex >= answers.length) {
                errors.push({
                    label: 'correctIndex',
                    path: `data.questions.${qi}.correctIndex`,
                    message: 'correctIndex is out of bounds for the given answers.',
                });
            }
        }
    });

    const minCorrectToPass = data?.minCorrectToPass;
    if (minCorrectToPass !== undefined && minCorrectToPass !== null) {
        if (typeof minCorrectToPass !== 'number' || !Number.isFinite(minCorrectToPass) || minCorrectToPass < 0) {
            errors.push({
                label: 'minCorrectToPass',
                path: 'data.minCorrectToPass',
                message: 'minCorrectToPass must be a valid non-negative number.',
            });
        }
    }

    return errors;
};