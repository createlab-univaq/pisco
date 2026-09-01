'use client';

import { useState } from 'react';
import { uploadImageAction, deleteImageAction } from '@/lib/actions/images';
import { IMAGE_PATH } from '@/lib/server/api-paths';
import styles from './QuestionImageUploadField.module.css';

export type QuestionImageUploadFieldProps = {
    parentNodeId?: string;
    parentItemId?: string;
    imageId?: string;
    onImageIdChange: (newImageId: string | undefined) => void;
    isDisabled?: boolean;
    error?: string;
};

const QuestionImageUploadField = ({
    parentNodeId,
    imageId,
    onImageIdChange,
    isDisabled = false,
    error,
}: QuestionImageUploadFieldProps) => {
    const [uploading, setUploading] = useState(false);

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    const imageUrl = imageId
        ? (imageId.startsWith('data:') ? imageId : `${apiBaseUrl}${IMAGE_PATH}/${imageId}`)
        : '';

    const containerClass = `${styles.container} ${error ? styles.containerInvalid : ''}`;

    const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const result = reader.result as string;
                resolve(result.includes(',') ? result.split(',')[1] : result);
            };
            reader.onerror = error => reject(error);
        });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || isDisabled) return;

        const ok =
            ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.type) ||
            /\.(png|jpg|jpeg|webp)$/i.test(file.name);

        if (!ok) {
            window.alert('Formato non supportato (Scegli PNG/JPG/WEBP)');
            return;
        }

        try {
            setUploading(true);
            const base64 = await convertFileToBase64(file);

            const formData = new FormData();
            formData.append('image', base64);
            formData.append('mimeType', file.type || 'image/jpeg');

            const result = await uploadImageAction(formData);

            if (result.error || !result.imagePath) {
                window.alert(result.error || 'Upload fallito');
                return;
            }

            onImageIdChange(result.imagePath);
        } catch (err: any) {
            console.error('UPLOAD ERROR', err);
            window.alert('Upload fallito: ' + err.message);
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    const onDelete = async () => {
        if (isDisabled || !imageId) return;

        try {
            await deleteImageAction(imageId);
            onImageIdChange(undefined);
        } catch (err: any) {
            console.error('DELETE ERROR', err);
            window.alert('Eliminazione fallita');
        }
    };

    return (
        <div className={containerClass}>
            <div className={styles.header}>
                <span className={styles.label}>Immagine (PNG/JPG/WEBP)</span>
                <span className={`${styles.badge} ${imageId ? styles.badgeSuccess : styles.badgeDefault}`}>
                    {uploading ? 'Caricamento...' : imageId ? 'Immagine presente' : 'Nessuna immagine'}
                </span>
            </div>

            {!imageId && (
                <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleFileChange}
                    disabled={isDisabled || uploading}
                    className={styles.fileInput}
                />
            )}

            {imageId && (
                <div className={styles.buttonGroup}>
                    <button
                        type="button"
                        className={`${styles.btn} ${styles.btnDelete}`}
                        onClick={onDelete}
                        disabled={isDisabled || uploading}
                    >
                        Elimina Immagine
                    </button>
                </div>
            )}

            {imageId && (
                <div className={styles.previewContainer}>
                    <img
                        src={imageUrl}
                        alt="Question preview"
                        className={styles.previewImage}
                    />
                </div>
            )}

            {error && <span className={styles.errorText}>{error}</span>}
        </div>
    );
};

export default QuestionImageUploadField;