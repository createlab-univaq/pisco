'use server';

import { revalidatePath } from 'next/cache';
import { apiFetch } from '../server/apiClient';
import { FLOWS_PATH } from '../server/api-paths';

export async function deleteFlowAction(flowId: string) {
    try {
        const res = await apiFetch(`${FLOWS_PATH}/${flowId}`, {
            method: 'DELETE',
        });

        if (!res.ok) {
            return { error: 'Failed to delete flow.' };
        }

        // Golden Standard: Tell Next.js to purge the cache for this route 
        // so it automatically fetches the updated list without a hard reload.
        revalidatePath('/flows');
        return { success: true };
    } catch (error) {
        console.error('Delete flow error:', error);
        return { error: 'Network error occurred.' };
    }
}

export async function createFlowAction(data: { name: string, description: string, flowJson?: any }) {
    try {
        // Generate a UUID for the new flow as requested by the API payload spec
        const newId = crypto.randomUUID();

        const payload = {
            id: newId,
            name: data.name,
            description: data.description,
            published: false,
            flowJson: data.flowJson || {} // Guaranteed to be empty for standard creation
        };

        const res = await apiFetch(FLOWS_PATH, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => null);
            return { error: errorData?.detail || 'Failed to create flow.' };
        }

        const createdFlow = await res.json();

        // Purge the cache so the flows list updates instantly
        revalidatePath('/');

        return { success: true, flow: createdFlow };
    } catch (error) {
        console.error('Create flow error:', error);
        return { error: 'Network error occurred. Please try again.' };
    }
}