'use client';

import TextField from '@/components/forms/TextField';
import styles from './QuestionEditor.module.css';
import { EditorCardWrapper } from '@/components/layouts/EditorCardWrapper';

export type QuestionEditorProps = {
    index: number;
    questionText: string;
    isCorrect: boolean;
    onChange: (updatedText: string, updatedIsCorrect: boolean) => void;
    onRemove: () => void;
    getFieldError?: (path: string) => string | undefined;
};

export const QuestionEditor = ({ index, questionText, isCorrect, onChange, onRemove, getFieldError }: QuestionEditorProps) => {
    return (
        <EditorCardWrapper
            title={`Quesito #${index + 1}`}
            onRemove={onRemove}
            removeLabel="Rimuovi"
        >
            <TextField
                label="Testo della domanda"
                name={`q-${index}-text`}
                value={questionText || ''}
                onChange={(e) => onChange(e.target.value, isCorrect)}
                error={getFieldError?.(`data.questions.${index}`)}
            />

            <div className={styles.radioContainer}>
                <label className={styles.radioTitle}>Risposta corretta:</label>
                <div className={styles.radioGroup}>
                    <label className={styles.radioLabel}>
                        <input
                            type="radio"
                            name={`correct-ans-${index}`}
                            checked={isCorrect === true}
                            onChange={() => onChange(questionText, true)}
                        />
                        Vero
                    </label>
                    <label className={styles.radioLabel}>
                        <input
                            type="radio"
                            name={`correct-ans-${index}`}
                            checked={isCorrect === false}
                            onChange={() => onChange(questionText, false)}
                        />
                        Falso
                    </label>
                </div>
            </div>
        </EditorCardWrapper>
    );
};