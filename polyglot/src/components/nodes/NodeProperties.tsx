'use client';

import TextField from '@/components/forms/TextField';
import styles from './NodeProperties.module.css';

export type NodePropertiesProps = {
    activityDescription?: string;
    activityTitle?: string;
    title?: string;
    description?: string;
    onUpdateTitle?: (val: string) => void;
    onUpdateDescription?: (val: string) => void;
};

const NodeProperties = ({
    activityDescription,
    activityTitle = 'Activity description',
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
                        {activityTitle}
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
        </div>
    );
};

export default NodeProperties;