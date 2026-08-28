import { ValidationError } from "@/types/ValidationError";

export const validateGenericStrict = (
    type: string,
    data: any,
    allowEmptyKeys: string[] = []
): ValidationError[] => {
    const errors: ValidationError[] = [];
    if (!data) return [{ label: type, message: 'Missing data' }];

    for (const key in data) {
        if (allowEmptyKeys.includes(key)) continue;
        if (type === 'ContainerNode' && key === 'sections') continue;

        const v = data[key];

        if (v === undefined) {
            errors.push({
                label: key,
                path: `data.${key}`,
                message: 'Missing field.',
            });
            continue;
        }

        if (typeof v === 'string' && v.trim() === '') {
            errors.push({
                label: key,
                path: `data.${key}`,
                message: 'Cannot be empty.',
            });
            continue;
        }

        if (Array.isArray(v) && v.length === 0) {
            errors.push({
                label: key,
                path: `data.${key}`,
                message: 'Empty list.',
            });
            continue;
        }
    }

    return errors;
};