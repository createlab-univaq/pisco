// src/validation/generic.ts
export type ValidationError = { label: string; path?: string; message: string };

export const allowNullByType: Record<string, string[]> = {
  // feuxPasNode: ['correctIndex'], // lo aggiungiamo quando hai type+shape
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
  if (!data) return [{ label: type, message: 'data mancante' }];

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
        message: 'Campo mancante.',
      });
      continue;
    }

    if (v === null) {
      if (!allowNull.has(key)) {
        errors.push({
          label: key,
          path: `data.${key}`,
          message: 'Non può essere null.',
        });
      }
      continue;
    }

    if (typeof v === 'string') {
      if (v.trim() === '' && !allowEmptyStr.has(key)) {
        errors.push({
          label: key,
          path: `data.${key}`,
          message: 'Non può essere vuoto.',
        });
      }
      continue;
    }

    if (Array.isArray(v)) {
      if (v.length === 0 && !allowEmptyArr.has(key)) {
        errors.push({
          label: key,
          path: `data.${key}`,
          message: 'Lista vuota.',
        });
      }
      continue;
    }
  }

  return errors;
};
