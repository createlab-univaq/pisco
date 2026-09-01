import { validateGenericStrict } from '@/lib/validation/generic';
import { ValidationError } from '@/types/ValidationError';

const isNonEmptyString = (v: unknown) =>
    typeof v === 'string' && v.trim() !== '';

export const validateEmotionRecognitionExerciseANode = (data: any): ValidationError[] => {
    // FIX: Removed 'imageId' from allowedEmpty so it requires a valid image
    const allowedEmpty: string[] = [];
    const errors: ValidationError[] = validateGenericStrict('EmotionRecognitionExerciseANode', data, allowedEmpty);

    // FIX: Explicitly check for a missing or empty imageId to trigger the red border
    if (!isNonEmptyString(data?.imageId)) {
        errors.push({
            label: 'imageId',
            path: 'data.imageId',
            message: 'Immagine mancante.',
        });
    }

    // FIX: Split answers validation to independently catch missing arrays and blank answer text
    const answers = data?.answers;
    if (!Array.isArray(answers) || answers.length === 0) {
        errors.push({
            label: 'answers',
            path: 'data.answers',
            message: 'Insert at least one answer.',
        });
    } else if (answers.some(ans => !isNonEmptyString(ans))) {
        errors.push({
            label: 'answers',
            path: 'data.answers',
            message: 'Answers cannot be empty.',
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

    if (!isNonEmptyString(data?.explanation)) {
        errors.push({
            label: 'explanation',
            path: 'data.explanation',
            message: 'Missing explanation.',
        });
    }

    return errors;
};