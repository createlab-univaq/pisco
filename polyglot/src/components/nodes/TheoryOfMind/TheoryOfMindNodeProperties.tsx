'use client';

import TextField from '@/components/forms/TextField';
import SingleSelectAnswersField from '@/components/forms/SingleSelectAnswersField';
import styles from './TheoryOfMindNodeProperties.module.css';
import { PolyglotNodePropertiesProps } from '@/components/ElementMapping';
import NodeProperties from '../NodeProperties';
import { TheoryOfMindNode, TheoryOfMindQuestion, TheoryOfMindQuizItem } from './types';
import { useNodeSync } from '@/hooks/useNodeSync';

const newId = (prefix: string) =>
    globalThis.crypto?.randomUUID?.() ??
    `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;

// Reusable SVGs
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

/* ---------------- Question Editor ---------------- */
type QuestionEditorProps = {
    question: TheoryOfMindQuestion;
    index: number;
    onChange: (updated: TheoryOfMindQuestion) => void;
    onRemove: () => void;
};

const QuestionEditor = ({ question, index, onChange, onRemove }: QuestionEditorProps) => {
    return (
        <div className={styles.questionCard}>
            <div className={styles.cardHeader}>
                <h5 className={styles.cardTitle}>Q{index + 1}</h5>
                <button type="button" className={styles.removeBtnSmall} onClick={onRemove}>
                    <CloseIcon />
                    <span>Remove</span>
                </button>
            </div>

            <TextField
                label="Question"
                name={`q-${index}-text`}
                value={question.question || ''}
                onChange={(e) => onChange({ ...question, question: e.target.value })}
            />

            <SingleSelectAnswersField
                label="Answers"
                answers={question.answers || ['Si', 'No']}
                correctIndex={question.correctIndex !== null ? question.correctIndex : 0}
                onAnswersChange={(newAnswers) => onChange({ ...question, answers: newAnswers })}
                onCorrectIndexChange={(newIndex: number | null) => onChange({ ...question, correctIndex: newIndex })}
                minAnswers={2}
                defaultAnswers={['Si', 'No']}
                allowNoCorrect={false}
            />
        </div>
    );
};

/* ---------------- Story Editor ---------------- */
type StoryEditorProps = {
    story: TheoryOfMindQuizItem;
    index: number;
    onChange: (updated: TheoryOfMindQuizItem) => void;
    onRemove: () => void;
};

const StoryEditor = ({ story, index, onChange, onRemove }: StoryEditorProps) => {
    const questions = story.questions || [];

    const handleUpdateQuestion = (qIndex: number, updatedQuestion: TheoryOfMindQuestion) => {
        const newQuestions = [...questions];
        newQuestions[qIndex] = updatedQuestion;
        onChange({ ...story, questions: newQuestions });
    };

    const handleAddQuestion = () => {
        onChange({
            ...story,
            questions: [
                ...questions,
                {
                    question: '',
                    answers: ['Si', 'No'],
                    correctIndex: 0,
                }
            ]
        });
    };

    const handleRemoveQuestion = (qIndex: number) => {
        onChange({
            ...story,
            questions: questions.filter((_, i) => i !== qIndex)
        });
    };

    return (
        <div className={styles.storyCard}>
            <div className={styles.cardHeader}>
                <h4 className={styles.cardTitle}>Story #{index + 1}</h4>
                <button type="button" className={styles.removeBtnSmall} onClick={onRemove}>
                    <CloseIcon />
                    <span>Remove story</span>
                </button>
            </div>

            <TextField
                label="Narration"
                name={`story-${index}-narration`}
                value={story.narration || ''}
                onChange={(e) => onChange({ ...story, narration: e.target.value })}
                isTextArea
            />

            <div className={styles.subHeaderFlex}>
                <h5 className={styles.subTitle}>Questions</h5>
                <button type="button" className={styles.addBtnSmall} onClick={handleAddQuestion}>
                    <AddIcon />
                    <span>Add question</span>
                </button>
            </div>

            <div className={styles.questionsList}>
                {questions.map((q, i) => (
                    <QuestionEditor
                        key={i}
                        question={q}
                        index={i}
                        onChange={(updated) => handleUpdateQuestion(i, updated)}
                        onRemove={() => handleRemoveQuestion(i)}
                    />
                ))}
            </div>
        </div>
    );
};

/* ---------------- Root Component ---------------- */
const TheoryOfMindNodeProperties = ({ element, onUpdateElement }: PolyglotNodePropertiesProps) => {
    const node = element as TheoryOfMindNode;
    const data = node.data || {};
    const quizItems = data.quiz || [];

    const { handleBaseChange } = useNodeSync(node, onUpdateElement);

    const handleQuizChange = (newQuiz: TheoryOfMindQuizItem[]) => {
        onUpdateElement({ ...node, data: { ...node.data, quiz: newQuiz } });
    };

    const handleAddStory = () => {
        handleQuizChange([
            ...quizItems,
            { qid: newId('qid'), narration: '', questions: [] }
        ]);
    };

    const handleUpdateStory = (index: number, updatedStory: TheoryOfMindQuizItem) => {
        const updatedQuiz = [...quizItems];
        updatedQuiz[index] = updatedStory;
        handleQuizChange(updatedQuiz);
    };

    const handleRemoveStory = (index: number) => {
        handleQuizChange(quizItems.filter((_, i) => i !== index));
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

            <div className={styles.headerFlex}>
                <h3 className={styles.sectionTitle}>Stories</h3>
                <button type="button" className={styles.addBtnPrimary} onClick={handleAddStory}>
                    <AddIcon />
                    <span>Add story</span>
                </button>
            </div>

            <div className={styles.storiesList}>
                {quizItems.map((story, i) => (
                    <StoryEditor
                        key={story.qid || i}
                        story={story}
                        index={i}
                        onChange={(updated) => handleUpdateStory(i, updated)}
                        onRemove={() => handleRemoveStory(i)}
                    />
                ))}
            </div>
        </div>
    );
};

export default TheoryOfMindNodeProperties;