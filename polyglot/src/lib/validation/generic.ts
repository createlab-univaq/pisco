export type ValidationError = { label: string; path?: string; message: string };

export const allowNullByType: Record<string, string[]> = {
    // fauxPasNode: ['correctIndex'], // Add when you have type+shape defined
};

export const allowEmptyStringByType: Record<string, string[]> = {
    // someNode: ['optionalTitle'],
};

export const allowEmptyArrayByType: Record<string, string[]> = {
    // someNode: ['tags'],
};

export const validateGenericStrict = (
    type: string,
    data: any,
    allowedEmptyFields: string[]
): ValidationError[] => {
    const errors: ValidationError[] = [];
    if (!data) return [{ label: type, message: 'Missing data' }]; 

    const allowNull = new Set(allowNullByType[type] ?? []); 
    const allowEmptyStr = new Set(allowEmptyStringByType[type] ?? []); 
    const allowEmptyArr = new Set(allowEmptyArrayByType[type] ?? []); 

    for (const key in data) {
        if (allowedEmptyFields.includes(key)) continue; 
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

        if (v === null) {
            if (!allowNull.has(key)) {
                errors.push({
                    label: key,
                    path: `data.${key}`,
                    message: 'Cannot be null.',
                });
            }
            continue;
        } 

        if (typeof v === 'string') {
            if (v.trim() === '' && !allowEmptyStr.has(key)) {
                errors.push({
                    label: key,
                    path: `data.${key}`,
                    message: 'Cannot be empty.',
                });
            }
            continue;
        } 

        if (Array.isArray(v)) {
            if (v.length === 0 && !allowEmptyArr.has(key)) {
                errors.push({
                    label: key,
                    path: `data.${key}`,
                    message: 'Empty list.',
                });
            }
            continue;
        } 
    }

    return errors;
};