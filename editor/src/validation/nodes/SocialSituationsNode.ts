// src/validation/nodes/socialSituationsNode.ts
import type { ValidationError } from '../generic';

const isNonEmptyString = (v: unknown) =>
  typeof v === 'string' && v.trim() !== '';

const isFiniteNumber = (v: unknown) =>
  typeof v === 'number' && Number.isFinite(v);

const isValidAnswer = (a: any) =>
  a && isNonEmptyString(a.text) && isFiniteNumber(a.score);

export const validateSocialSituationsNode = (data: any): ValidationError[] => {
  const errors: ValidationError[] = [];

  const items = data?.items;
  if (!Array.isArray(items) || items.length === 0) {
    errors.push({
      label: 'items',
      path: 'data.items',
      message: 'Inserisci almeno un item.',
    });
    return errors;
  }

  items.forEach((item: any, i: number) => {
    if (!isNonEmptyString(item?.sid)) {
      errors.push({
        label: 'sid',
        path: `data.items.${i}.sid`,
        message: 'sid mancante.',
      });
    }

    const sections = item?.sections;
    if (!Array.isArray(sections) || sections.length === 0) {
      errors.push({
        label: 'sections',
        path: `data.items.${i}.sections`,
        message: 'Inserisci almeno una sezione.',
      });
      return;
    }

    sections.forEach((s: any, j: number) => {
      const before = (s?.before ?? '').trim();
      const bold = (s?.bold ?? '').trim();
      const after = (s?.after ?? '').trim();

      if (before === '' && bold === '' && after === '') {
        errors.push({
          label: 'testi sezione',
          path: `data.items.${i}.sections.${j}`,
          message: 'Almeno uno tra before/bold/after deve essere valorizzato.',
        });
      }

      const answers = s?.answers;
      if (
        !Array.isArray(answers) ||
        answers.length === 0 ||
        !answers.every(isValidAnswer)
      ) {
        errors.push({
          label: 'answers',
          path: `data.items.${i}.sections.${j}.answers`,
          message:
            'Inserisci almeno una risposta (testo non vuoto + score numerico).',
        });
      }

      const correctIndexes = s?.correctIndexes;
      if (!Array.isArray(correctIndexes)) {
        errors.push({
          label: 'correctIndexes',
          path: `data.items.${i}.sections.${j}.correctIndexes`,
          message: 'correctIndexes deve essere un array.',
        });
      } else {
        // se vuoi obbligare almeno una corretta, lascia; altrimenti rimuovi
        if (correctIndexes.length === 0) {
          errors.push({
            label: 'correctIndexes',
            path: `data.items.${i}.sections.${j}.correctIndexes`,
            message: 'Seleziona almeno una risposta corretta.',
          });
        }

        if (Array.isArray(answers) && answers.length > 0) {
          const seen = new Set<number>();
          correctIndexes.forEach((idx: any) => {
            if (!Number.isInteger(idx) || idx < 0 || idx >= answers.length) {
              errors.push({
                label: 'correctIndexes',
                path: `data.items.${i}.sections.${j}.correctIndexes`,
                message: 'Contiene indici non validi.',
              });
            } else if (seen.has(idx)) {
              errors.push({
                label: 'correctIndexes',
                path: `data.items.${i}.sections.${j}.correctIndexes`,
                message: 'Contiene indici duplicati.',
              });
            }
            seen.add(idx);
          });
        }
      }
    });
  });

  return errors;
};
