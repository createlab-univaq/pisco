import { validateGenericStrict } from '@/lib/validation/generic';
import { ValidationError } from '@/types/ValidationError';

const isNonEmptyString = (v: unknown) =>
    typeof v === 'string' && v.trim() !== '';

export const validateEmotionRecognitionNode = (data: any): ValidationError[] => {
    const allowedEmpty = ['imageId'];
    const errors: ValidationError[] = validateGenericStrict('EmotionRecognitionNode', data, allowedEmpty);

    const answers = data?.answers;
    if (
        !Array.isArray(answers) ||
        answers.length === 0 ||
        !answers.every(isNonEmptyString)
    ) {
        errors.push({
            label: 'answers',
            path: 'data.answers',
            message: 'Insert at least one non-empty answer.',
        });
    }

    const correctIndex = data?.correctIndex;
    if (!Number.isInteger(correctIndex)) {
        errors.push({
            label: 'correctIndex',
            path: 'data.correctIndex',
            message: 'Select a correct answer index.',
        });
    } else if (Array.isArray(answers) && answers.length > 0) {
        if (correctIndex < 0 || correctIndex >= answers.length) {
            errors.push({
                label: 'correctIndex',
                path: 'data.correctIndex',
                message: 'correctIndex is out of bounds for the given answers.',
            });
        }
    }

    return errors;
};