import { ValidationError } from '@/types/ValidationError';

export const validateConditionalEdge = (data: any): ValidationError[] => {
    const errors: ValidationError[] = [];
    const rawThreshold = data?.threshold;

    // Check if the threshold is missing or is not a valid number
    if (rawThreshold === undefined || rawThreshold === null || Number.isNaN(Number(rawThreshold))) {
        errors.push({
            label: 'threshold',
            path: 'data.threshold',
            message: 'Threshold must be a valid number.',
        });
    }

    return errors;
};