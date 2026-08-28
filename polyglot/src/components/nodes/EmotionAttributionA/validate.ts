import { validateGenericStrict } from '@/lib/validation/generic';
import { ValidationError } from '@/types/ValidationError';

const isNonEmptyString = (v: unknown) =>
    typeof v === 'string' && v.trim() !== '';

export const validateEmotionAttributionANode = (data: any): ValidationError[] => {
    // spiegazioneS and spiegazioneR are optional/allowed to be empty strings by default[cite: 25, 28]
    const allowedEmpty = ['spiegazioneS', 'spiegazioneR'];
    const errors: ValidationError[] = validateGenericStrict('EmotionAttributionANode', data, allowedEmpty);

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
    if (
        !Array.isArray(risposteCorrette) ||
        risposteCorrette.length === 0 ||
        !risposteCorrette.every(isNonEmptyString)
    ) {
        errors.push({
            label: 'risposteCorrette',
            path: 'data.risposteCorrette',
            message: 'Insert at least one non-empty correct answer.',
        });
    }

    return errors;
};