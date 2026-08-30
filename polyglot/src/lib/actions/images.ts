'use server';

import { apiFetch } from '../server/apiClient';
import { IMAGE_PATH } from '../server/api-paths';

export async function uploadImageAction(base64Image: string, mimeType: string) {
    try {
        const res = await apiFetch(IMAGE_PATH, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mimeType, image: base64Image })
        });

        if (!res.ok) {
            return { error: 'Image upload failed.' };
        }

        const data = await res.json();
        const imagePath = typeof data === 'string' ? data : (data.path || data.url || data);
        return { success: true, imagePath };
    } catch (error) {
        console.error('Upload image error:', error);
        return { error: 'Network error during image upload.' };
    }
}

export async function deleteImageAction(imageId: string) {
    try {
        // Extract ID or handle full path if passed as ID
        const cleanId = imageId.split('/').pop() || imageId;
        const res = await apiFetch(`${IMAGE_PATH}/${cleanId}`, {
            method: 'DELETE',
        });

        if (!res.ok && res.status !== 204) {
            return { error: 'Image deletion failed.' };
        }

        return { success: true };
    } catch (error) {
        console.error('Delete image error:', error);
        return { error: 'Network error during image deletion.' };
    }
}