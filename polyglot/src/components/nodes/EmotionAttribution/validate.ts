import { validateGenericStrict } from '@/lib/validation/generic';
import { ValidationError } from '@/types/ValidationError';

const isNonEmptyString = (v: unknown) =>
    typeof v === 'string' && v.trim() !== '';

export const validateEmotionAttributionNode = (data: any): ValidationError[] => {
    const allowedEmpty: string[] = [];
    const errors: ValidationError[] = validateGenericStrict('EmotionAttributionNode', data, allowedEmpty);

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

        if (!isNonEmptyString(q?.narration)) {
            errors.push({
                label: 'narration',
                path: `data.questions.${qi}.narration`,
                message: 'Missing narration.',
            });
        }

        if (!isNonEmptyString(q?.question)) {
            errors.push({
                label: 'question',
                path: `data.questions.${qi}.question`,
                message: 'Missing question text.',
            });
        }

        const correctAnswers = q?.correctAnswers;
        if (
            !Array.isArray(correctAnswers) ||
            correctAnswers.length === 0 ||
            !correctAnswers.every(isNonEmptyString)
        ) {
            errors.push({
                label: 'correctAnswers',
                path: `data.questions.${qi}.correctAnswers`,
                message: 'Insert at least one non-empty correct answer.',
            });
        }
    });

    return errors;
};