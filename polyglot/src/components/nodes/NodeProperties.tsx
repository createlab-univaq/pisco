'use client';

import EnumField from '@/components/forms/EnumField';
import TextField from '@/components/forms/TextField';
import styles from './NodeProperties.module.css';

export type NodePropertiesProps = {
    activityDescription?: string;
    title?: string;
    description?: string;
    onUpdateTitle?: (val: string) => void;
    onUpdateDescription?: (val: string) => void;
};

const NodeProperties = ({
    activityDescription,
    title,
    description,
    onUpdateTitle,
    onUpdateDescription,
}: NodePropertiesProps) => {
    return (
        <div className={styles.container}>
            {activityDescription && (
                <div className={styles.activityBox}>
                    <strong className={styles.activityTitle}>
                        Activity description
                    </strong>
                    <p className={styles.activityText}>{activityDescription}</p>
                </div>
            )}

            <TextField
                label="Title"
                name="title"
                value={title || ''}
                onChange={(e) => onUpdateTitle?.(e.target.value)}
                isRequired
            />

            <TextField
                label="Description"
                name="description"
                value={description || ''}
                onChange={(e) => onUpdateDescription?.(e.target.value)}
                isTextArea
            />

            <div className={styles.row}>
                <div className={styles.fieldWrapper}>
                    <EnumField
                        label="Difficulty"
                        name="difficulty"
                        hidden={true}
                        options={
                            <>
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                                <option value={4}>4</option>
                                <option value={5}>5</option>
                            </>
                        }
                    />
                </div>

            </div>
        </div>
    );
};

export default NodeProperties;