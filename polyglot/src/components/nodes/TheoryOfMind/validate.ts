import { validateGenericStrict } from '@/lib/validation/generic';
import { ValidationError } from '@/types/ValidationError';

const isNonEmptyString = (v: unknown) =>
    typeof v === 'string' && v.trim() !== '';

export const validateTheoryOfMindNode = (data: any): ValidationError[] => {
    const allowedEmpty: string[] = [];
    const errors: ValidationError[] = validateGenericStrict('TheoryOfMindNode', data, allowedEmpty);

    const quiz = data?.quiz;
    if (!Array.isArray(quiz) || quiz.length === 0) {
        errors.push({
            label: 'quiz',
            path: 'data.quiz',
            message: 'Insert at least one quiz item.',
        });
        return errors;
    }

    quiz.forEach((item: any, qi: number) => {
        if (!isNonEmptyString(item?.qid)) {
            errors.push({
                label: 'qid',
                path: `data.quiz.${qi}.qid`,
                message: 'Missing qid.',
            });
        }

        if (!isNonEmptyString(item?.narration)) {
            errors.push({
                label: 'narration',
                path: `data.quiz.${qi}.narration`,
                message: 'Missing narration.',
            });
        }

        const questions = item?.questions;
        if (!Array.isArray(questions) || questions.length === 0) {
            errors.push({
                label: 'questions',
                path: `data.quiz.${qi}.questions`,
                message: 'Insert at least one question.',
            });
            return;
        }

        questions.forEach((q: any, qj: number) => {
            if (!isNonEmptyString(q?.question)) {
                errors.push({
                    label: 'question',
                    path: `data.quiz.${qi}.questions.${qj}.question`,
                    message: 'Missing question text.',
                });
            }

            const answers = q?.answers;
            if (!Array.isArray(answers) || answers.length === 0) {
                errors.push({
                    label: 'answers',
                    path: `data.quiz.${qi}.questions.${qj}.answers`,
                    message: 'Insert at least one answer.',
                });
            } else if (answers.some(ans => !isNonEmptyString(ans))) {
                errors.push({
                    label: 'answers',
                    path: `data.quiz.${qi}.questions.${qj}.answers`,
                    message: 'Answers cannot be empty.',
                });
            }

            const ci = q?.correctIndex;

            if (!Number.isInteger(ci)) {
                errors.push({
                    label: 'correctIndex',
                    path: `data.quiz.${qi}.questions.${qj}.correctIndex`,
                    message: 'Select a correct answer.',
                });
                return;
            }

            if (Array.isArray(answers) && answers.length > 0) {
                if (ci < 0 || ci >= answers.length) {
                    errors.push({
                        label: 'correctIndex',
                        path: `data.quiz.${qi}.questions.${qj}.correctIndex`,
                        message: 'correctIndex is out of bounds for the given answers.',
                    });
                }
            }
        });
    });

    return errors;
};