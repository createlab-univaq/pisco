import { validateGenericStrict } from '@/lib/validation/generic';
import { ValidationError } from '@/types/ValidationError';

const isNonEmptyString = (v: unknown) =>
    typeof v === 'string' && v.trim() !== '';

export const validateEmotionAttributionExerciseANode = (data: any): ValidationError[] => {
    // FIX: Removed 'spiegazioneS' and 'spiegazioneR' from allowedEmpty
    const allowedEmpty: string[] = [];
    const errors: ValidationError[] = validateGenericStrict('EmotionAttributionExerciseANode', data, allowedEmpty);

    if (!isNonEmptyString(data?.scenario)) {
        errors.push({
            label: 'scenario',
            path: 'data.scenario',
            message: 'Missing or empty scenario.',
        });
    }

    if (!isNonEmptyString(data?.domanda)) {
        errors.push({
            label: 'domanda',
            path: 'data.domanda',
            message: 'Missing or empty domanda.',
        });
    }

    const risposteCorrette = data?.risposteCorrette;
    if (!Array.isArray(risposteCorrette) || risposteCorrette.length === 0) {
        errors.push({
            label: 'risposteCorrette',
            path: 'data.risposteCorrette',
            message: 'Insert at least one correct answer.',
        });
    } else if (risposteCorrette.some(ans => !isNonEmptyString(ans))) {
        errors.push({
            label: 'risposteCorrette',
            path: 'data.risposteCorrette',
            message: 'Answers cannot be empty.',
        });
    }

    if (!isNonEmptyString(data?.spiegazioneS)) {
        errors.push({
            label: 'spiegazioneS',
            path: 'data.spiegazioneS',
            message: 'Spiegazione (Scenario) cannot be empty.',
        });
    }

    if (!isNonEmptyString(data?.spiegazioneR)) {
        errors.push({
            label: 'spiegazioneR',
            path: 'data.spiegazioneR',
            message: 'Spiegazione (Risposta) cannot be empty.',
        });
    }

    return errors;
};