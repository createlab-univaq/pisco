'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import TextField from '@/components/forms/TextField';
import { updateUserAction, deleteUserAction } from '@/lib/actions/user';
import { Analyst } from '@/types';
import styles from './Profile.module.css';
import ConfirmModal from '@/components/modals/ConfirmModal';

export default function ProfileClient({ analyst }: { analyst: Analyst }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            const formData = new FormData(e.currentTarget);
            const result = await updateUserAction(formData);

            if (result?.error) {
                setMessage({ type: 'error', text: result.error });
            } else {
                setMessage({ type: 'success', text: 'Profilo aggiornato con successo.' });
                (e.target as HTMLFormElement).password.value = '';
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Si è verificato un errore imprevisto.' });
        } finally {
            setIsLoading(false); // Guaranteed to stop spinning
        }
    };

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            const result = await deleteUserAction();

            if (result?.error) {
                setMessage({ type: 'error', text: result.error });
                setShowDeleteModal(false);
            } else {
                router.push('/login');
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Si è verificato un errore di rete.' });
            setShowDeleteModal(false);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Impostazioni Account</h1>

            {message && (
                <div className={message.type === 'error' ? styles.errorBox : styles.successBox}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleUpdate} className={styles.form}>
                <TextField label="Nome" name="firstName" defaultValue={analyst.firstName} required isDisabled={isLoading} />
                <TextField label="Cognome" name="lastName" defaultValue={analyst.lastName} required isDisabled={isLoading} />
                <TextField label="Indirizzo Email" name="email" type="email" defaultValue={analyst.email} required isDisabled={isLoading} />

                {/* Fixed placeholder to prevent label/text collision */}
                <TextField label="Nuova Password (Opzionale)" name="password" type="password" placeholder=" " isDisabled={isLoading} />

                <button type="submit" className={styles.saveBtn} disabled={isLoading}>
                    {isLoading ? 'Salvataggio...' : 'Salva Modifiche'}
                </button>
            </form>

            <div className={styles.dangerZone}>
                <h3>Zona Pericolosa</h3>
                <p>L'eliminazione dell'account è irreversibile. Tutti i tuoi percorsi andranno persi.</p>
                <button type="button" onClick={() => setShowDeleteModal(true)} className={styles.deleteBtn} disabled={isLoading}>
                    Elimina Account
                </button>
            </div>

            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                isProcessing={isLoading}
                title="Elimina Account"
                message="Sei sicuro di voler eliminare il tuo account? Questa azione è irreversibile e perderai tutti i dati associati."
                confirmText="Sì, Elimina"
                processingText="Eliminazione in corso..."
                cancelText="Annulla"
            />
        </div>
    );
}