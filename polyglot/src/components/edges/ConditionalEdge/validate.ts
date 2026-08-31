import { ValidationError } from '@/types/ValidationError';

export const validateConditionalEdge = (data: any): ValidationError[] => {
    const errors: ValidationError[] = [];
    const rawThreshold = data?.threshold;

    if (rawThreshold === undefined || rawThreshold === null || Number.isNaN(Number(rawThreshold))) {
        errors.push({
            label: 'threshold',
            path: 'data.threshold',
            message: 'Threshold must be a valid number.',
        });
        return errors;
    }

    const threshold = Number(rawThreshold);
    if (threshold < 0) {
        errors.push({
            label: 'threshold',
            path: 'data.threshold',
            message: 'Threshold cannot be less than 0.',
        });
    }

    return errors;
};