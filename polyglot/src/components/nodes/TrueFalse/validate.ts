import { validateGenericStrict } from '@/lib/validation/generic';
import { ValidationError } from '@/types/ValidationError';

const isNonEmptyString = (v: unknown) =>
    typeof v === 'string' && v.trim() !== '';

export const validateTrueFalseNode = (data: any): ValidationError[] => {
    const allowedEmpty = ['instructions', 'negativePoints', 'positivePoints'];
    const errors: ValidationError[] = validateGenericStrict('TrueFalseNode', data, allowedEmpty);

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

    const positivePoints = data?.positivePoints;
    if (positivePoints !== undefined && positivePoints !== null) {
        if (typeof positivePoints !== 'number' || !Number.isFinite(positivePoints)) {
            errors.push({
                label: 'positivePoints',
                path: 'data.positivePoints',
                message: 'positivePoints must be a valid number.',
            });
        }
    }

    const negativePoints = data?.negativePoints;
    if (negativePoints !== undefined && negativePoints !== null) {
        if (typeof negativePoints !== 'number' || !Number.isFinite(negativePoints)) {
            errors.push({
                label: 'negativePoints',
                path: 'data.negativePoints',
                message: 'negativePoints must be a valid number.',
            });
        }
    }

    return errors;
};