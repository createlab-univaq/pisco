import { validateGenericStrict } from "@/lib/validation/generic";
import { ValidationError } from "@/types/ValidationError";

const isNonEmptyString = (v: unknown) =>
    typeof v === 'string' && v.trim() !== '';

export const validateFauxPasNode = (data: any): ValidationError[] => {
    const allowedEmpty: string[] = [];
    const errors: ValidationError[] = validateGenericStrict('FauxPasNode', data, allowedEmpty);

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
            if (
                !Array.isArray(answers) ||
                answers.length === 0 ||
                !answers.every(isNonEmptyString)
            ) {
                errors.push({
                    label: 'answers',
                    path: `data.quiz.${qi}.questions.${qj}.answers`,
                    message: 'Insert at least one (non-empty) answer.',
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

            const skipIf = q?.skipIf;

            if (!skipIf?.enabled) {
                return;
            }

            if (qj === 0) {
                errors.push({
                    label: 'skipIf',
                    path: `data.quiz.${qi}.questions.${qj}.skipIf`,
                    message: 'The first question cannot have a skip condition.',
                });
                return;
            }

            const skipQuestionIndex = skipIf?.questionIndex;
            const skipAnswerIndex = skipIf?.answerIndex;

            if (!Number.isInteger(skipQuestionIndex)) {
                errors.push({
                    label: 'skipIf.questionIndex',
                    path: `data.quiz.${qi}.questions.${qj}.skipIf.questionIndex`,
                    message: 'If skip is active, select a previous question.',
                });
                return;
            }

            if (skipQuestionIndex < 0 || skipQuestionIndex >= qj) {
                errors.push({
                    label: 'skipIf.questionIndex',
                    path: `data.quiz.${qi}.questions.${qj}.skipIf.questionIndex`,
                    message: 'The skip condition can only refer to a previous question.',
                });
                return;
            }

            const previousQuestion = questions[skipQuestionIndex];
            const previousAnswers = previousQuestion?.answers;

            if (!Number.isInteger(skipAnswerIndex)) {
                errors.push({
                    label: 'skipIf.answerIndex',
                    path: `data.quiz.${qi}.questions.${qj}.skipIf.answerIndex`,
                    message: 'If skip is active, select a previous answer.',
                });
                return;
            }

            if (
                !Array.isArray(previousAnswers) ||
                skipAnswerIndex < 0 ||
                skipAnswerIndex >= previousAnswers.length
            ) {
                errors.push({
                    label: 'skipIf.answerIndex',
                    path: `data.quiz.${qi}.questions.${qj}.skipIf.answerIndex`,
                    message: 'The selected answer for the skip condition does not exist in the previous question.',
                });
            }
        });
    });

    return errors;
};