'use server';

import { cookies } from 'next/headers';
import { apiFetch } from '../server/apiClient';
import { REGISTER_PATH } from '../server/api-paths';
import { logoutAction } from './auth';
import { revalidatePath } from 'next/cache';

export async function updateUserAction(formData: FormData) {
    try {
        const cookieStore = await cookies();
        const userId = cookieStore.get('userId')?.value;

        if (!userId) return { error: 'Non autorizzato.' };

        const payload = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            password: formData.get('password') || undefined,
        };

        const res = await apiFetch(`${REGISTER_PATH}/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => null);
            return { error: errorData?.detail || 'Errore durante l\'aggiornamento.' };
        }

        revalidatePath('/profile');
        return { success: true };
    } catch (error) {
        console.error('Update user error:', error);
        return { error: 'Si è verificato un errore di rete.' };
    }
}

export async function deleteUserAction() {
    try {
        const cookieStore = await cookies();
        const userId = cookieStore.get('userId')?.value;

        if (!userId) return { error: 'Non autorizzato.' };

        const res = await apiFetch(`${REGISTER_PATH}/${userId}`, {
            method: 'DELETE',
        });

        if (!res.ok) return { error: 'Errore durante l\'eliminazione dell\'account.' };

        await logoutAction();
        return { success: true };
    } catch (error) {
        console.error('Delete user error:', error);
        return { error: 'Si è verificato un errore di rete.' };
    }
}