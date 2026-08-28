import { validateGenericStrict } from '@/lib/validation/generic';
import { ValidationError } from '@/types/ValidationError';

const isNonEmptyString = (v: unknown) =>
    typeof v === 'string' && v.trim() !== '';

export const validateTheoryOfMindExerciseANode = (data: any): ValidationError[] => {
    const allowedEmpty = ['imageId', 'explanation'];
    const errors: ValidationError[] = validateGenericStrict('TheoryOfMindExerciseANode', data, allowedEmpty);

    const quiz = data?.quiz;
    if (!Array.isArray(quiz) || quiz.length === 0) {
        errors.push({
            label: 'quiz',
            path: 'data.quiz',
            message: 'Insert at least one item.',
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

        if (!isNonEmptyString(item?.caption)) {
            errors.push({
                label: 'caption',
                path: `data.quiz.${qi}.caption`,
                message: 'Missing caption.',
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
            if (!isNonEmptyString(q?.qid)) {
                errors.push({
                    label: 'qid',
                    path: `data.quiz.${qi}.questions.${qj}.qid`,
                    message: 'Missing question qid.',
                });
            }

            if (!isNonEmptyString(q?.question)) {
                errors.push({
                    label: 'question',
                    path: `data.quiz.${qi}.questions.${qj}.question`,
                    message: 'Missing question text.',
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
                    path: `data.quiz.${qi}.questions.${qj}.answers`,
                    message: 'Insert at least one non-empty answer.',
                });
            }

            const correctIndex = q?.correctIndex;
            if (!Number.isInteger(correctIndex)) {
                errors.push({
                    label: 'correctIndex',
                    path: `data.quiz.${qi}.questions.${qj}.correctIndex`,
                    message: 'Select a correct answer index.',
                });
            } else if (Array.isArray(answers) && answers.length > 0) {
                if (correctIndex < 0 || correctIndex >= answers.length) {
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