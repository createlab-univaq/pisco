'use client';

import { useState } from 'react';
import { deleteImageAction } from '@/lib/actions/images';
import styles from './EyesTaskNodeProperties.module.css';
import { PolyglotNodePropertiesProps } from '@/types/ElementMappingTypes';
import { EyesTaskNode, EyesTaskQuestion } from './types';
import NodeProperties from '../NodeProperties';
import { useNodeSync } from '@/hooks/useNodeSync';
import { QuestionEditor } from './components/QuestionEditor';
import { validateEyesTaskNode } from './validate';

const newId = (prefix: string) =>
    globalThis.crypto?.randomUUID?.() ??
    `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;

const AddIcon = () => (
    <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

const EyesTaskNodeProperties = ({ element, onUpdateElement }: PolyglotNodePropertiesProps) => {
    const [isDeleting, setIsDeleting] = useState<number | null>(null);

    const node = element as EyesTaskNode;
    const data = node.data || {};
    const questions = data.questions || [];
    const nodeId = node._id;

    const { handleBaseChange, handleDataChange } = useNodeSync(node, onUpdateElement);

    const validationErrors = validateEyesTaskNode(data);

    const handleAddQuestion = () => {
        handleDataChange({
            questions: [
                ...questions,
                {
                    qid: newId('q'),
                    imageId: undefined,
                    answers: ['', ''],
                    correctIndex: 0,
                },
            ],
        });
    };

    const handleRemoveQuestion = async (index: number) => {
        const questionToDelete = questions[index];
        const imageIdToDelete = questionToDelete?.imageId;

        setIsDeleting(index);

        if (imageIdToDelete) {
            try {
                await deleteImageAction(imageIdToDelete);
            } catch (e) {
                console.error('Delete image failed', e);
                window.alert('Immagine non eliminata: Non sono riuscito a eliminare l’immagine associata. Riprova più tardi.');
                setIsDeleting(null);
                return;
            }
        }

        handleDataChange({
            questions: questions.filter((_, i) => i !== index),
        });

        setIsDeleting(null);
    };

    const handleUpdateQuestion = (index: number, updatedQuestion: EyesTaskQuestion) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index] = updatedQuestion;
        handleDataChange({ questions: updatedQuestions });
    };

    return (
        <div className={styles.container}>
            <NodeProperties
                activityDescription="Crea una lista di quesiti con un’immagine per ciascuno. Ogni quesito ha più risposte: seleziona quella corretta."
                title={node.title}
                description={node.description}
                onUpdateTitle={(val) => handleBaseChange({ title: val })}
                onUpdateDescription={(val) => handleBaseChange({ description: val })}
            />

            <hr className={styles.divider} />

            {validationErrors.length > 0 && (
                <div style={{ padding: '0 0.5rem', marginBottom: '0.5rem', color: '#e53e3e', fontSize: '0.875rem' }}>
                    <strong>Validation Errors:</strong>
                    <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                        {validationErrors.map((err, idx) => (
                            <li key={idx}>[{err.path}]: {err.message}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className={styles.headerFlex}>
                <h3 className={styles.sectionTitle}>Quesiti</h3>
                <button type="button" className={styles.addBtn} onClick={handleAddQuestion}>
                    <AddIcon />
                    <span>Aggiungi quesito</span>
                </button>
            </div>

            {questions.length === 0 && (
                <div className={styles.emptyState}>
                    <p className={styles.emptyText}>
                        Nessun quesito ancora. Clicca <b>Aggiungi quesito</b> per iniziare.
                    </p>
                </div>
            )}

            <div className={styles.questionsList}>
                {questions.map((q, index) => (
                    <QuestionEditor
                        key={q.qid || index}
                        question={q}
                        index={index}
                        nodeId={nodeId}
                        isDeleting={isDeleting === index}
                        onChange={(updated) => handleUpdateQuestion(index, updated)}
                        onRemove={() => handleRemoveQuestion(index)}
                    />
                ))}
            </div>

            {questions.length > 0 && (
                <button
                    type="button"
                    className={`${styles.addBtn} ${styles.fullWidthBtn}`}
                    onClick={handleAddQuestion}
                >
                    <AddIcon />
                    <span>Aggiungi quesito</span>
                </button>
            )}
        </div>
    );
};

export default EyesTaskNodeProperties;