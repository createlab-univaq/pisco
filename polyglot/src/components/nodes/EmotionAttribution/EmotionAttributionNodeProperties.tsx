'use client';

import { useEffect, useRef } from 'react';
import styles from './EmotionAttributionNodeProperties.module.css';
import { EmotionAttributionNode, EmotionAttributionQuestion } from './types';
import NodeProperties from '../NodeProperties';
import { useNodeSync } from '@/hooks/useNodeSync';
import { PolyglotNodePropertiesProps } from '@/types/ElementMappingTypes';
import { QuestionEditor } from '@/components/nodes/EmotionAttribution/components/QuestionEditor';
import { validateEmotionAttributionNode } from './validate';

const newId = (prefix: string) =>
    globalThis.crypto?.randomUUID?.() ??
    `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;

const AddIcon = () => (
    <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

const EmotionAttributionNodeProperties = ({ element, onUpdateElement }: PolyglotNodePropertiesProps) => {
    const node = element as EmotionAttributionNode;
    const data = node.data || {};
    const hasMigrated = useRef(false);

    const { handleBaseChange, handleDataChange } = useNodeSync(node, onUpdateElement);

    const validationResultErrors = validateEmotionAttributionNode(data);

    const getFieldError = (path: string) => validationResultErrors.find(e => e.path === path)?.message;

    useEffect(() => {
        if (hasMigrated.current) return;

        let needsUpdate = false;
        const newData = { ...data } as any;

        // 1. Legacy migration from 'tests' to 'questions'
        if ((!newData.questions || !Array.isArray(newData.questions)) && Array.isArray(newData.tests) && newData.tests.length > 0) {
            const first = newData.tests[0];
            newData.minCorrectToPass = typeof first?.minCorrectToPass === 'number' ? first.minCorrectToPass : 0;
            newData.questions = (first?.questions ?? []).map((q: any) => ({
                qid: q.qid ?? newId('q'),
                narration: q.narration ?? '',
                question: q.question ?? '',
                correctAnswers: Array.isArray(q.correctAnswers) ? q.correctAnswers : [q.correctAnswer ?? ''],
            }));
            delete newData.tests;
            needsUpdate = true;
        }

        // 2. Normalize existing questions structure
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

        // 3. Default numeric fields if missing
        if (newData.minCorrectToPass == null) {
            newData.minCorrectToPass = 0;
            needsUpdate = true;
        }

        if (needsUpdate) {
            handleDataChange(newData);
        }

        hasMigrated.current = true;
    }, [data, handleDataChange]);

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

    const handleUpdateQuestion = (index: number, updatedQuestion: EmotionAttributionQuestion) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index] = updatedQuestion;
        handleDataChange({ questions: updatedQuestions });
    };

    return (
        <div className={styles.container}>
            <NodeProperties
                title={node.title}
                description={node.description}
                onUpdateTitle={(val) => handleBaseChange({ title: val })}
                onUpdateDescription={(val) => handleBaseChange({ description: val })}
            />

            <hr className={styles.divider} />

            {validationResultErrors.length > 0 && (
                <div style={{ padding: '0 0.5rem', marginBottom: '0.5rem', color: '#e53e3e', fontSize: '0.875rem' }}>
                    <strong>Validation Errors:</strong>
                    <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                        {validationResultErrors.map((err, idx) => (
                            <li key={idx}>[{err.path}]: {err.message}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Top Action Button */}
            <div className={styles.headerFlex}>
                <h3 className={styles.sectionTitle}>Quesiti</h3>
                <button type="button" className={styles.addBtn} onClick={handleAddQuestion}>
                    <AddIcon />
                    <span>Aggiungi Quesito</span>
                </button>
            </div>

            {/* Empty State Feedback */}
            {questions.length === 0 && (
                <div className={styles.emptyState}>
                    <p className={styles.emptyText}>
                        Nessun quesito ancora. Clicca <b>Aggiungi Quesito</b> per iniziare.
                    </p>
                </div>
            )}

            <div className={styles.questionsList}>
                {questions.map((q, qIndex) => (
                    <QuestionEditor
                        key={q.qid || qIndex}
                        question={q}
                        index={qIndex}
                        onChange={(updated) => handleUpdateQuestion(qIndex, updated)}
                        onRemove={() => handleRemoveQuestion(qIndex)}
                        getFieldError={getFieldError}
                    />
                ))}
            </div>

            {/* Bottom Action Button (Dual-Placement Standard) */}
            {questions.length > 0 && (
                <div style={{ marginTop: '1rem', padding: '0 0.5rem' }}>
                    <button
                        type="button"
                        className={styles.addBtn}
                        onClick={handleAddQuestion}
                        style={{ width: '100%', justifyContent: 'center' }}
                    >
                        <AddIcon />
                        <span>Aggiungi Quesito</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default EmotionAttributionNodeProperties;