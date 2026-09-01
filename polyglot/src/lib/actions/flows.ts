'use server';

import { revalidatePath } from 'next/cache';
import { apiFetch } from '../server/apiClient';
import { FLOWS_PATH } from '../server/api-paths';
import { PolyglotFlow } from '@/types/PolyglotFlow';
import { Flow } from '@/types';

export async function getFlowsAction(searchQuery?: string) {
    try {
        const url = searchQuery
            ? `${FLOWS_PATH}?name=${encodeURIComponent(searchQuery)}`
            : FLOWS_PATH;

        const res = await apiFetch(url, {
            method: 'GET',
        });

        if (!res.ok) {
            return { error: 'Failed to fetch flows.', status: res.status };
        }

        const data = await res.json();
        return { success: true, data };
    } catch (error) {
        console.error('Get flows error:', error);
        return { error: 'Network error occurred.' };
    }
}

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

export async function saveFlowAction(flowId: string, updatedFlow: Flow) {
    try {
        const res = await apiFetch(`${FLOWS_PATH}/${flowId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedFlow)
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

export async function createFlowAction(data: { name: string, description: string, flowJson: PolyglotFlow }) {
    try {
        const newId = crypto.randomUUID();

        const payload = {
            id: newId,
            name: data.name,
            description: data.description,
            published: false,
            flowJson: data.flowJson
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

        const createdFlow: Flow = await res.json();
        revalidatePath('/');

        return { success: true, flow: createdFlow };
    } catch (error) {
        console.error('Create flow error:', error);
        return { error: 'Network error occurred. Please try again.' };
    }
}