'use client';

import TextField from '@/components/forms/TextField';
import styles from './SectionEditor.module.css';
import { SocialSituationsExerciseASection, SocialSituationsExerciseAAnswer } from '../types';

const CloseIcon = () => (
    <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export type SectionEditorProps = {
    section: SocialSituationsExerciseASection;
    sectionIndex: number;
    onChange: (updatedSection: SocialSituationsExerciseASection) => void;
    onRemoveSection: () => void;
};

export const SectionEditor = ({ section, sectionIndex, onChange, onRemoveSection }: SectionEditorProps) => {
    // Ensure answers array always contains 4 items
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

    return (
        <div className={styles.sectionCard}>
            <div className={styles.cardHeader}>
                <h5 className={styles.cardTitle}>Sezione #{sectionIndex + 1}</h5>
                <button type="button" className={styles.removeBtnSmall} onClick={onRemoveSection}>
                    <CloseIcon />
                    <span>Rimuovi sezione</span>
                </button>
            </div>

            <TextField
                label="Testo iniziale"
                name={`section-${sectionIndex}-before`}
                value={section.before || ''}
                onChange={(e) => onChange({ ...section, before: e.target.value })}
                isTextArea
            />
            <TextField
                label="Parte in grassetto"
                name={`section-${sectionIndex}-bold`}
                value={section.bold || ''}
                onChange={(e) => onChange({ ...section, bold: e.target.value })}
            />
            <TextField
                label="Testo finale"
                name={`section-${sectionIndex}-after`}
                value={section.after || ''}
                onChange={(e) => onChange({ ...section, after: e.target.value })}
                isTextArea
            />

            <hr className={styles.innerDivider} />

            <div>
                <label className={styles.sectionLabel} style={{ display: 'block', marginBottom: '8px' }}>
                    Risposte (4 opzioni, seleziona la corretta e inserisci la spiegazione)
                </label>
                {answers.map((ansItem, ansIdx) => (
                    <div key={ansIdx} style={{ display: 'flex', gap: '8px', marginBottom: '10px', alignItems: 'flex-start' }}>
                        <input
                            type="radio"
                            name={`correct-answer-sec-${sectionIndex}`}
                            checked={section.correctIndex === ansIdx}
                            onChange={() => onChange({ ...section, correctIndex: ansIdx })}
                            style={{ marginTop: '8px' }}
                            title="Imposta come risposta corretta"
                        />
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <input
                                type="text"
                                placeholder={`Risposta ${ansIdx + 1}`}
                                value={ansItem.text}
                                onChange={(e) => handleAnswerChange(ansIdx, 'text', e.target.value)}
                                style={{ width: '100%', padding: '4px 8px', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                            />
                            <input
                                type="text"
                                placeholder={`Spiegazione per Risposta ${ansIdx + 1}`}
                                value={ansItem.explanation}
                                onChange={(e) => handleAnswerChange(ansIdx, 'explanation', e.target.value)}
                                style={{ width: '100%', padding: '4px 8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.8rem', background: '#f8fafc' }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};