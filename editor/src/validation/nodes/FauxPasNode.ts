// src/validation/nodes/fauxPasNode.ts
import type { ValidationError } from '../generic';

const isNonEmptyString = (v: unknown) =>
  typeof v === 'string' && v.trim() !== '';

export const validateFauxPasNode = (data: any): ValidationError[] => {
  const errors: ValidationError[] = [];

  const quiz = data?.quiz;
  if (!Array.isArray(quiz) || quiz.length === 0) {
    errors.push({
      label: 'quiz',
      path: 'data.quiz',
      message: 'Inserisci almeno un quiz item.',
    });
    return errors;
  }

  quiz.forEach((item: any, qi: number) => {
    if (!isNonEmptyString(item?.qid)) {
      errors.push({
        label: 'qid',
        path: `data.quiz.${qi}.qid`,
        message: 'qid mancante.',
      });
    }

    if (!isNonEmptyString(item?.narration)) {
      errors.push({
        label: 'narration',
        path: `data.quiz.${qi}.narration`,
        message: 'narration mancante.',
      });
    }

    const questions = item?.questions;
    if (!Array.isArray(questions) || questions.length === 0) {
      errors.push({
        label: 'questions',
        path: `data.quiz.${qi}.questions`,
        message: 'Inserisci almeno una domanda.',
      });
      return;
    }

    questions.forEach((q: any, qj: number) => {
      if (!isNonEmptyString(q?.question)) {
        errors.push({
          label: 'question',
          path: `data.quiz.${qi}.questions.${qj}.question`,
          message: 'Testo domanda mancante.',
        });
      }

      const answers = q?.answers;
      if (
        !Array.isArray(answers) ||
        answers.length === 0 ||
        !answers.every(isNonEmptyString)
      ) {
        errors.push({
          label: 'answers',
          path: `data.quiz.${qi}.questions.${qj}.answers`,
          message: 'Inserisci almeno una risposta (non vuota).',
        });
      }

      const ci = q?.correctIndex;

      if (!Number.isInteger(ci)) {
        errors.push({
          label: 'correctIndex',
          path: `data.quiz.${qi}.questions.${qj}.correctIndex`,
          message: 'Seleziona una risposta corretta.',
        });
        return;
      }

      if (Array.isArray(answers) && answers.length > 0) {
        if (ci < 0 || ci >= answers.length) {
          errors.push({
            label: 'correctIndex',
            path: `data.quiz.${qi}.questions.${qj}.correctIndex`,
            message: 'correctIndex fuori range rispetto alle answers.',
          });
        }
      }

      const skipIf = q?.skipIf;

      if (!skipIf?.enabled) {
        return;
      }

      if (qj === 0) {
        errors.push({
          label: 'skipIf',
          path: `data.quiz.${qi}.questions.${qj}.skipIf`,
          message: 'La prima domanda non può avere una condizione di skip.',
        });
        return;
      }

      const skipQuestionIndex = skipIf?.questionIndex;
      const skipAnswerIndex = skipIf?.answerIndex;

      if (!Number.isInteger(skipQuestionIndex)) {
        errors.push({
          label: 'skipIf.questionIndex',
          path: `data.quiz.${qi}.questions.${qj}.skipIf.questionIndex`,
          message: 'Se lo skip è attivo, seleziona una domanda precedente.',
        });
        return;
      }

      if (skipQuestionIndex < 0 || skipQuestionIndex >= qj) {
        errors.push({
          label: 'skipIf.questionIndex',
          path: `data.quiz.${qi}.questions.${qj}.skipIf.questionIndex`,
          message:
            'La condizione di skip può riferirsi solo a una domanda precedente.',
        });
        return;
      }

      const previousQuestion = questions[skipQuestionIndex];
      const previousAnswers = previousQuestion?.answers;

      if (!Number.isInteger(skipAnswerIndex)) {
        errors.push({
          label: 'skipIf.answerIndex',
          path: `data.quiz.${qi}.questions.${qj}.skipIf.answerIndex`,
          message: 'Se lo skip è attivo, seleziona una risposta precedente.',
        });
        return;
      }

      if (
        !Array.isArray(previousAnswers) ||
        skipAnswerIndex < 0 ||
        skipAnswerIndex >= previousAnswers.length
      ) {
        errors.push({
          label: 'skipIf.answerIndex',
          path: `data.quiz.${qi}.questions.${qj}.skipIf.answerIndex`,
          message:
            'La risposta selezionata per lo skip non esiste nella domanda precedente.',
        });
      }
    });
  });

  return errors;
};
