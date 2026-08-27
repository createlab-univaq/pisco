'use client';

import { useState } from 'react';
import TextField from '@/components/forms/TextField';
import QuestionImageUploadField from '@/components/forms/QuestionImageUploadField';
import styles from './TheoryOfMindExerciseANodeProperties.module.css';
import { PolyglotNodePropertiesProps } from '@/types/polyglot-elements/ElementMappingTypes';
import NodeProperties from '../NodeProperties';
import { TheoryOfMindExerciseANode, TheoryOfMindExerciseAItem, TheoryOfMindExerciseAQuestion } from './types';
import { useNodeSync } from '@/hooks/useNodeSync';
import { FilesAPI } from '@/data/api';

const newId = (prefix: string) =>
    globalThis.crypto?.randomUUID?.() ??
    `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;

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

const createDefaultQuestions = (): TheoryOfMindExerciseAQuestion[] => [
    { qid: newId('q'), question: '', answers: ['Si', 'No'], correctIndex: 0, explanation: '' },
    { qid: newId('q'), question: '', answers: ['Si', 'No'], correctIndex: 0, explanation: '' },
];

/* ---------------- Question Editor (Fixed Yes/No) ---------------- */
type QuestionEditorProps = {
    question: TheoryOfMindExerciseAQuestion;
    index: number;
    onChange: (updated: TheoryOfMindExerciseAQuestion) => void;
};

const QuestionEditor = ({ question, index, onChange }: QuestionEditorProps) => {
    return (
        <div className={styles.questionCard}>
            <h5 className={styles.cardTitle}>Domanda #{index + 1}</h5>

            <TextField
                label="Testo della domanda"
                name={`q-${index}-text`}
                value={question.question || ''}
                onChange={(e) => onChange({ ...question, question: e.target.value })}
            />

            <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                <label className={styles.sectionTitle} style={{ display: 'block', marginBottom: '6px' }}>
                    Risposta Corretta (Sì / No)
                </label>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.875rem' }}>
                        <input
                            type="radio"
                            name={`correct-ans-${index}-${question.qid}`}
                            checked={question.correctIndex === 0}
                            onChange={() => onChange({ ...question, correctIndex: 0 })}
                        />
                        Sì
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.875rem' }}>
                        <input
                            type="radio"
                            name={`correct-ans-${index}-${question.qid}`}
                            checked={question.correctIndex === 1}
                            onChange={() => onChange({ ...question, correctIndex: 1 })}
                        />
                        No
                    </label>
                </div>
            </div>

            <TextField
                label="Spiegazione"
                name={`q-${index}-explanation`}
                value={question.explanation || ''}
                onChange={(e) => onChange({ ...question, explanation: e.target.value })}
                isTextArea
            />
        </div>
    );
};

/* ---------------- Item / Story Editor ---------------- */
type ItemEditorProps = {
    item: TheoryOfMindExerciseAItem;
    index: number;
    nodeId: string;
    isDeleting: boolean;
    onChange: (updatedItem: TheoryOfMindExerciseAItem) => void;
    onRemove: () => void;
};

const ItemEditor = ({ item, index, nodeId, isDeleting, onChange, onRemove }: ItemEditorProps) => {
    const questions = item.questions?.length === 2 ? item.questions : createDefaultQuestions();

    const handleUpdateQuestion = (qIndex: number, updatedQuestion: TheoryOfMindExerciseAQuestion) => {
        const newQuestions = [...questions] as [TheoryOfMindExerciseAQuestion, TheoryOfMindExerciseAQuestion];
        newQuestions[qIndex] = updatedQuestion;
        onChange({ ...item, questions: newQuestions });
    };

    return (
        <div className={styles.storyCard}>
            <div className={styles.cardHeader}>
                <h4 className={styles.cardTitle}>Elemento Immagine #{index + 1}</h4>
                <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={onRemove}
                    disabled={isDeleting}
                    aria-label="Rimuovi elemento"
                >
                    {isDeleting ? '...' : <CloseIcon />}
                </button>
            </div>

            {nodeId ? (
                <QuestionImageUploadField
                    parentNodeId={nodeId}
                    parentItemId={item.qid}
                    imageId={item.imageId}
                    onImageIdChange={(newId: string | undefined) => onChange({ ...item, imageId: newId })}
                />
            ) : (
                <p className={styles.hintText}>Seleziona il nodo per caricare un’immagine.</p>
            )}

            <hr className={styles.innerDivider} />

            <TextField
                label="Didascalia (Caption)"
                name={`item-${index}-caption`}
                value={item.caption || ''}
                onChange={(e) => onChange({ ...item, caption: e.target.value })}
                isTextArea
            />

            <div className={styles.subHeaderFlex}>
                <h5 className={styles.subTitle}>Domande (Fisse: 2)</h5>
            </div>

            <div className={styles.questionsList}>
                {questions.map((q, i) => (
                    <QuestionEditor
                        key={q.qid || i}
                        question={q}
                        index={i}
                        onChange={(updated) => handleUpdateQuestion(i, updated)}
                    />
                ))}
            </div>
        </div>
    );
};

/* ---------------- Root Component ---------------- */
const TheoryOfMindExerciseANodeProperties = ({ element, onUpdateElement }: PolyglotNodePropertiesProps) => {
    const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

    const node = element as TheoryOfMindExerciseANode;
    const data = node.data || {};
    const quizItems = data.quiz || [];
    const nodeId = node._id;

    const { handleBaseChange, handleDataChange } = useNodeSync(node, onUpdateElement);

    const handleQuizChange = (newQuiz: TheoryOfMindExerciseAItem[]) => {
        handleDataChange({ quiz: newQuiz });
    };

    const handleAddItem = () => {
        handleQuizChange([
            ...quizItems,
            {
                qid: newId('qid'),
                imageId: undefined,
                caption: '',
                questions: createDefaultQuestions(),
            }
        ]);
    };

    const handleUpdateItem = (index: number, updatedItem: TheoryOfMindExerciseAItem) => {
        const updatedQuiz = [...quizItems];
        updatedQuiz[index] = updatedItem;
        handleQuizChange(updatedQuiz);
    };

    const handleRemoveItem = async (index: number) => {
        const itemToDelete = quizItems[index];
        const imageIdToDelete = itemToDelete?.imageId;

        setDeletingIndex(index);

        if (imageIdToDelete) {
            try {
                await FilesAPI.delete(imageIdToDelete);
            } catch (e) {
                console.error('Delete image failed', e);
                window.alert('Immagine non eliminata: Non sono riuscito a eliminare l’immagine associata. Riprova più tardi.');
                setDeletingIndex(null);
                return;
            }
        }

        handleQuizChange(quizItems.filter((_, i) => i !== index));
        setDeletingIndex(null);
    };

    return (
        <div className={styles.container}>
            <NodeProperties
                activityDescription="Crea elementi visivi con didascalia ed esattamente 2 quesiti a risposta Sì/No con spiegazione."
                title={node.title}
                description={node.description}
                onUpdateTitle={(val) => handleBaseChange({ title: val })}
                onUpdateDescription={(val) => handleBaseChange({ description: val })}
            />

            <hr className={styles.divider} />

            <div className={styles.headerFlex}>
                <h3 className={styles.sectionTitle}>Elementi Teoria della Mente</h3>
                <button type="button" className={styles.addBtn} onClick={handleAddItem}>
                    <AddIcon />
                    <span>Aggiungi elemento</span>
                </button>
            </div>

            {quizItems.length === 0 && (
                <div className={styles.emptyState}>
                    <p className={styles.emptyText}>
                        Nessun elemento ancora. Clicca <b>Aggiungi elemento</b> per iniziare.
                    </p>
                </div>
            )}

            <div className={styles.storiesList}>
                {quizItems.map((item, i) => (
                    <ItemEditor
                        key={item.qid || i}
                        item={item}
                        index={i}
                        nodeId={nodeId}
                        isDeleting={deletingIndex === i}
                        onChange={(updated) => handleUpdateItem(i, updated)}
                        onRemove={() => handleRemoveItem(i)}
                    />
                ))}
            </div>
        </div>
    );
};

export default TheoryOfMindExerciseANodeProperties;