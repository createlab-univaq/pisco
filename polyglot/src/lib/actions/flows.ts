'use server';

import { revalidatePath } from 'next/cache';
import { apiFetch } from '../server/apiClient';
import { FLOWS_PATH } from '../server/api-paths';

export async function getFlowAction(flowId: string) {
    try {
        const res = await apiFetch(`${FLOWS_PATH}/${flowId}`, {
            method: 'GET',
        });

        if (!res.ok) {
            return { error: 'Flow not found', status: res.status };
        }

        const data = await res.json();
        return { success: true, data };
    } catch (error) {
        console.error('Get flow error:', error);
        return { error: 'Network error occurred.' };
    }
}

export async function saveFlowAction(flowId: string, flowJson: any) {
    try {
        const res = await apiFetch(`${FLOWS_PATH}/${flowId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ flowJson })
        });

        if (!res.ok) {
            return { error: 'Failed to save flow.' };
        }

        const data = await res.json();
        revalidatePath(`/flows/${flowId}`);
        return { success: true, data };
    } catch (error) {
        console.error('Save flow error:', error);
        return { error: 'Network error occurred.' };
    }
}

export async function deleteFlowAction(flowId: string) {
    try {
        const res = await apiFetch(`${FLOWS_PATH}/${flowId}`, {
            method: 'DELETE',
        });

        if (!res.ok) {
            return { error: 'Failed to delete flow.' };
        }

        revalidatePath('/');
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