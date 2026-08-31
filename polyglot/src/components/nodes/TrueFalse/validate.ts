import { validateGenericStrict } from '@/lib/validation/generic';
import { ValidationError } from '@/types/ValidationError';

const isNonEmptyString = (v: unknown) =>
    typeof v === 'string' && v.trim() !== '';

export const validateTrueFalseNode = (data: any): ValidationError[] => {
    const allowedEmpty = ['negativePoints', 'positivePoints'];
    const errors: ValidationError[] = validateGenericStrict('TrueFalseNode', data, allowedEmpty);

    if (!isNonEmptyString(data?.instructions)) {
        errors.push({
            label: 'instructions',
            path: 'data.instructions',
            message: 'Instructions cannot be empty.',
        });
    }

    const questions = data?.questions;
    if (!Array.isArray(questions) || questions.length === 0 || !questions.every(isNonEmptyString)) {
        errors.push({
            label: 'questions',
            path: 'data.questions',
            message: 'Insert at least one non-empty question.',
        });
    }

    const isQuestionCorrect = data?.isQuestionCorrect;
    if (!Array.isArray(isQuestionCorrect)) {
        errors.push({
            label: 'isQuestionCorrect',
            path: 'data.isQuestionCorrect',
            message: 'isQuestionCorrect must be an array.',
        });
    } else if (Array.isArray(questions) && questions.length > 0) {
        if (isQuestionCorrect.length !== questions.length) {
            errors.push({
                label: 'isQuestionCorrect',
                path: 'data.isQuestionCorrect',
                message: 'isQuestionCorrect length must match questions length.',
            });
        }
    }

    return errors;
};