'use client';

import TextField from '@/components/forms/TextField';
import styles from './SectionEditor.module.css';
import { SocialSituationsExerciseASection, SocialSituationsExerciseAAnswer } from '../types';
import { EditorCardWrapper, EditorCardDivider } from '@/components/layouts/EditorCardWrapper';

export type SectionEditorProps = {
    section: SocialSituationsExerciseASection;
    sectionIndex: number;
    onChange: (updatedSection: SocialSituationsExerciseASection) => void;
    onRemoveSection: () => void;
    itemIndex: number;
    getFieldError: (path: string) => string | undefined;
};

export const SectionEditor = ({ section, sectionIndex, onChange, onRemoveSection, itemIndex, getFieldError }: SectionEditorProps) => {
    const answers = section.answers?.length === 4 ? section.answers : [
        { text: '', explanation: '' },
        { text: '', explanation: '' },
        { text: '', explanation: '' },
        { text: '', explanation: '' },
    ];

    const handleAnswerChange = (ansIndex: number, field: keyof SocialSituationsExerciseAAnswer, value: string) => {
        const updatedAnswers = [...answers] as [
            SocialSituationsExerciseAAnswer,
            SocialSituationsExerciseAAnswer,
            SocialSituationsExerciseAAnswer,
            SocialSituationsExerciseAAnswer
        ];
        updatedAnswers[ansIndex] = { ...updatedAnswers[ansIndex], [field]: value };
        onChange({ ...section, answers: updatedAnswers });
    };

    const getAnswerError = (ansIdx: number, field: 'text' | 'explanation') => {
        return getFieldError(`data.items.${itemIndex}.sections.${sectionIndex}.answers.${ansIdx}.${field}`);
    };

    return (
        <EditorCardWrapper
            title={`Sezione #${sectionIndex + 1}`}
            onRemove={onRemoveSection}
            removeLabel="Rimuovi sezione"
        >
            <TextField
                label="Testo iniziale"
                name={`section-${sectionIndex}-before`}
                value={section.before || ''}
                onChange={(e) => onChange({ ...section, before: e.target.value })}
                isTextArea
                error={getFieldError(`data.items.${itemIndex}.sections.${sectionIndex}.before`)}
            />
            <TextField
                label="Parte in grassetto"
                name={`section-${sectionIndex}-bold`}
                value={section.bold || ''}
                onChange={(e) => onChange({ ...section, bold: e.target.value })}
                error={getFieldError(`data.items.${itemIndex}.sections.${sectionIndex}.bold`)}
            />
            <TextField
                label="Testo finale"
                name={`section-${sectionIndex}-after`}
                value={section.after || ''}
                onChange={(e) => onChange({ ...section, after: e.target.value })}
                isTextArea
                error={getFieldError(`data.items.${itemIndex}.sections.${sectionIndex}.after`)}
            />

            <EditorCardDivider />

            <div>
                <label className={styles.sectionLabel}>
                    Risposte (4 opzioni, seleziona la corretta e inserisci la spiegazione)
                </label>
                {answers.map((ansItem, ansIdx) => {
                    const textErr = getAnswerError(ansIdx, 'text');
                    const expErr = getAnswerError(ansIdx, 'explanation');
                    return (
                        <div key={ansIdx} className={styles.answerRow}>
                            <input
                                type="radio"
                                name={`correct-answer-sec-${sectionIndex}`}
                                checked={section.correctIndex === ansIdx}
                                onChange={() => onChange({ ...section, correctIndex: ansIdx })}
                                className={styles.radioInput}
                                title="Imposta come risposta corretta"
                            />
                            <div className={styles.inputsWrapper}>
                                <input
                                    type="text"
                                    placeholder={`Risposta ${ansIdx + 1}`}
                                    value={ansItem.text}
                                    onChange={(e) => handleAnswerChange(ansIdx, 'text', e.target.value)}
                                    className={`${styles.textInput} ${textErr ? styles.inputInvalid : ''}`}
                                />
                                <input
                                    type="text"
                                    placeholder={`Spiegazione per Risposta ${ansIdx + 1}`}
                                    value={ansItem.explanation}
                                    onChange={(e) => handleAnswerChange(ansIdx, 'explanation', e.target.value)}
                                    className={`${styles.explanationInput} ${expErr ? styles.inputInvalid : ''}`}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </EditorCardWrapper>
    );
};