'use client';

import { useEffect, useRef } from 'react';
import TextField from '@/components/forms/TextField';
import StringArrayField from '@/components/forms/StringArrayField'; // Assuming this was refactored in a previous step
import styles from './EmotionAttributionNodeProperties.module.css';
import { PolyglotNodePropertiesProps } from '@/components/ElementMapping';
import { EmotionAttributionNode, EmotionAttributionQuestion } from './types';
import NodeProperties from '../NodeProperties';
import { useNodeSync } from '@/hooks/useNodeSync';

// Genera un id (preferibilmente UUID se disponibile)
const newId = (prefix: string) =>
    globalThis.crypto?.randomUUID?.() ??
    `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;

// Reusable SVGs replacing Chakra Icons
const AddIcon = () => (
    <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

const CloseIcon = () => (
    <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const EmotionAttributionNodeProperties = ({ element, onUpdateElement }: PolyglotNodePropertiesProps) => {
    const node = element as EmotionAttributionNode;
    const data = node.data || {};
    const hasMigrated = useRef(false);

    const { handleBaseChange, handleDataChange } = useNodeSync(node, onUpdateElement);

    /**
     * Migrazione retro-compat (legacy):
     * Ensures old data formats (like data.tests or correctAnswer) are safely
     * migrated to the new schema upon mount.
     */
    useEffect(() => {
        if (hasMigrated.current) return;

        let needsUpdate = false;
        const newData = { ...data } as any;

        // Caso legacy: non ho questions, ma ho tests -> migro
        if ((!newData.questions || !Array.isArray(newData.questions)) && Array.isArray(newData.tests) && newData.tests.length > 0) {
            const first = newData.tests[0];

            newData.minCorrectToPass = typeof first?.minCorrectToPass === 'number' ? first.minCorrectToPass : 0;
            newData.questions = (first?.questions ?? []).map((q: any) => ({
                qid: q.qid ?? newId('q'),
                narration: q.narration ?? '',
                question: q.question ?? '',
                correctAnswers: Array.isArray(q.correctAnswers) ? q.correctAnswers : [q.correctAnswer ?? ''],
            }));

            delete newData.tests; // Rimuovo il legacy container
            needsUpdate = true;
        }

        // Normalizzo eventuale legacy correctAnswer dentro questions
        if (Array.isArray(newData.questions)) {
            let questionsChanged = false;
            const normalized = newData.questions.map((q: any) => {
                const isLegacyAnswer = !Array.isArray(q.correctAnswers) && q.correctAnswer !== undefined;
                const isMissingId = !q.qid;

                if (isLegacyAnswer || isMissingId) {
                    questionsChanged = true;
                }

                return {
                    qid: q.qid ?? newId('q'),
                    narration: q.narration ?? '',
                    question: q.question ?? '',
                    correctAnswers: Array.isArray(q.correctAnswers) ? q.correctAnswers : [q.correctAnswer ?? ''],
                };
            });

            if (questionsChanged) {
                newData.questions = normalized;
                needsUpdate = true;
            }
        }

        // Default minCorrectToPass se mancante
        if (newData.minCorrectToPass == null) {
            newData.minCorrectToPass = 0;
            needsUpdate = true;
        }

        // Default questions se mancante
        if (!newData.questions || newData.questions.length === 0) {
            newData.questions = [{ qid: newId('q'), narration: '', question: '', correctAnswers: [''] }];
            needsUpdate = true;
        }

        if (needsUpdate) {
            handleDataChange(newData);
        }

        hasMigrated.current = true;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    // Array manipulation handlers
    const questions = data.questions || [];

    const handleAddQuestion = () => {
        handleDataChange({
            questions: [
                ...questions,
                { qid: newId('q'), narration: '', question: '', correctAnswers: [''] },
            ],
        });
    };

    const handleRemoveQuestion = (indexToRemove: number) => {
        handleDataChange({
            questions: questions.filter((_, index) => index !== indexToRemove),
        });
    };

    const handleUpdateQuestion = (index: number, field: keyof EmotionAttributionQuestion, value: any) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index] = {
            ...updatedQuestions[index],
            [field]: value,
        };
        handleDataChange({ questions: updatedQuestions });
    };

    return (
        <div className={styles.container}>
            <NodeProperties
                platform={['WebApp']}
                title={node.title}
                description={node.description}
                onUpdateTitle={(val) => handleBaseChange({ title: val })}
                onUpdateDescription={(val) => handleBaseChange({ description: val })}
            />

            <hr className={styles.divider} />

            <div className={styles.headerFlex}>
                <h3 className={styles.sectionTitle}>Quesiti</h3>
                <button type="button" className={styles.addBtn} onClick={handleAddQuestion}>
                    <AddIcon />
                    <span>Aggiungi Quesito</span>
                </button>
            </div>

            <div className={styles.questionsList}>
                {questions.map((q, qIndex) => (
                    <div key={q.qid || qIndex} className={styles.questionCard}>

                        <div className={styles.cardHeader}>
                            <span className={styles.cardTitle}>Quesito {qIndex + 1}</span>
                            <button
                                type="button"
                                className={styles.removeBtn}
                                onClick={() => handleRemoveQuestion(qIndex)}
                                aria-label="Rimuovi quesito"
                                title="Rimuovi quesito"
                            >
                                <CloseIcon />
                            </button>
                        </div>

                        {/* Campi del quesito */}
                        <TextField
                            label="Narrazione"
                            name={`questions-${qIndex}-narration`}
                            value={q.narration || ''}
                            onChange={(e) => handleUpdateQuestion(qIndex, 'narration', e.target.value)}
                            isTextArea
                        />

                        <TextField
                            label="Domanda"
                            name={`questions-${qIndex}-question`}
                            value={q.question || ''}
                            onChange={(e) => handleUpdateQuestion(qIndex, 'question', e.target.value)}
                            isTextArea
                        />

                        <hr className={styles.innerDivider} />

                        <h4 className={styles.listHeading}>Risposte corrette (lista)</h4>

                        {/* Campo generico: array di stringhe */}
                        <StringArrayField
                            values={q.correctAnswers || []}
                            onChange={(updatedAnswers) => handleUpdateQuestion(qIndex, 'correctAnswers', updatedAnswers)}
                            itemLabel="Risposta corretta"
                            addLabel="Aggiungi risposta corretta"
                            defaultItemValue=""
                            keepAtLeastOne
                        />

                    </div>
                ))}
            </div>
        </div>
    );
};

export default EmotionAttributionNodeProperties;