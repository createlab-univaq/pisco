'use client';

import { useEffect, useMemo, useState } from 'react';
import { FilesAPI } from '@/data/api';
import styles from './QuestionImageUploadField.module.css';

export type QuestionImageUploadFieldProps = {
    parentNodeId: string;
    parentItemId?: string;
    imageId?: string;
    onImageIdChange: (newImageId: string | undefined) => void;
    isDisabled?: boolean;
};

const QuestionImageUploadField = ({
    parentNodeId,
    parentItemId,
    imageId,
    onImageIdChange,
    isDisabled = false,
}: QuestionImageUploadFieldProps) => {

    const [file, setFile] = useState<File | undefined>(undefined);
    const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
    const [checking, setChecking] = useState(false);
    const [hasRemote, setHasRemote] = useState(false);

    const canUse = useMemo(() => !!parentNodeId, [parentNodeId]);

    // If an image ID exists or it is verified as present on the server, block new uploads
    const hasImageAlready = useMemo(
        () => !!imageId || hasRemote,
        [imageId, hasRemote]
    );

    // Cleanup preview URL on unmount
    useEffect(() => {
        return () => {
            if (previewUrl) window.URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    // When imageId changes: check remote presence and reset states
    useEffect(() => {
        let cancelled = false;

        const checkRemote = async () => {
            if (!imageId) {
                setHasRemote(false);
                return;
            }
            setChecking(true);
            try {
                await FilesAPI.download(imageId);
                if (!cancelled) setHasRemote(true);
            } catch {
                if (!cancelled) setHasRemote(false);
            } finally {
                if (!cancelled) setChecking(false);
            }
        };

        // Reset preview if image changes
        setPreviewUrl((prev) => {
            if (prev) window.URL.revokeObjectURL(prev);
            return undefined;
        });

        // Reset selected file when image changes
        setFile(undefined);

        checkRemote();

        return () => {
            cancelled = true;
        };
    }, [imageId]);

    const onUpload = async () => {
        if (isDisabled) return;

        if (hasImageAlready) {
            window.alert("C'è già un'immagine: Elimina prima quella esistente per caricarne un’altra.");
            return;
        }

        if (!canUse) {
            window.alert('ID nodo non valido');
            return;
        }

        if (!file) {
            window.alert("Seleziona un'immagine");
            return;
        }

        const ok =
            ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.type) ||
            /\.(png|jpg|jpeg|webp)$/i.test(file.name);

        if (!ok) {
            window.alert('Formato non supportato (Scegli PNG/JPG/WEBP)');
            return;
        }

        try {
            const resp = await FilesAPI.uploadGeneric(parentNodeId, file, parentItemId);

            const newImageId = resp?.imageId;
            if (!newImageId) {
                window.alert('Upload ok ma imageId mancante');
                return;
            }

            // Write imageId up to parent state
            onImageIdChange(newImageId);

            setHasRemote(true);
            setFile(undefined);

            // Using console.log instead of toast for standard success to avoid alert spam
            console.log('Immagine caricata con successo');
        } catch (e: any) {
            const msg = e?.message ?? 'Upload fallito';
            console.error('UPLOAD ERROR', { msg, e });
            window.alert(`Upload fallito: ${msg}`);
        }
    };

    const onPreview = async () => {
        if (!imageId) return;

        try {
            const blob = await FilesAPI.download(imageId);
            const url = window.URL.createObjectURL(blob);

            setPreviewUrl((prev) => {
                if (prev) window.URL.revokeObjectURL(prev);
                return url;
            });
        } catch (e: any) {
            console.error('PREVIEW ERROR', e);
            window.alert('Immagine non trovata o errore download');
            setHasRemote(false);
        }
    };

    const onDelete = async () => {
        if (isDisabled || !imageId) return;

        try {
            await FilesAPI.delete(imageId);

            // Remove the reference from parent state
            onImageIdChange(undefined);

            setHasRemote(false);
            setFile(undefined);

            setPreviewUrl((prev) => {
                if (prev) window.URL.revokeObjectURL(prev);
                return undefined;
            });

            console.log('Immagine eliminata');
        } catch (e: any) {
            const msg = e?.message ?? 'Delete fallito';
            console.error('DELETE ERROR', { msg, e });
            window.alert(`Eliminazione fallita: ${msg}`);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <span className={styles.label}>Immagine (PNG/JPG/WEBP)</span>
                <span className={`${styles.badge} ${hasRemote ? styles.badgeSuccess : styles.badgeDefault}`}>
                    {checking
                        ? 'Controllo...'
                        : hasRemote
                            ? 'Immagine presente'
                            : 'Nessuna immagine'}
                </span>
            </div>

            <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => setFile(e.target.files?.[0])}
                disabled={isDisabled || !canUse || hasImageAlready}
                className={styles.fileInput}
            />

            <div className={styles.buttonGroup}>
                <button
                    type="button"
                    className={`${styles.btn} ${styles.btnUpload}`}
                    onClick={onUpload}
                    disabled={isDisabled || !canUse || hasImageAlready}
                >
                    Carica
                </button>
                <button
                    type="button"
                    className={`${styles.btn} ${styles.btnPreview}`}
                    onClick={onPreview}
                    disabled={!imageId || !hasRemote}
                >
                    Anteprima
                </button>
                <button
                    type="button"
                    className={`${styles.btn} ${styles.btnDelete}`}
                    onClick={onDelete}
                    disabled={!imageId || isDisabled}
                >
                    Elimina
                </button>
            </div>

            {previewUrl && (
                <div className={styles.previewContainer}>
                    <img
                        src={previewUrl}
                        alt="Question preview"
                        className={styles.previewImage}
                    />
                </div>
            )}
        </div>
    );
};

export default QuestionImageUploadField;