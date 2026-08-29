import type { Toast } from "$lib/types";

class ToastStore {
    toasts = $state<Toast[]>([]);

    add(message: string, type: 'success' | 'error' | 'info' = 'success', duration = 3500) {
        const id = crypto.randomUUID();
        const newToast: Toast = { id, message, type, duration };

        this.toasts.push(newToast);

        if (duration > 0) {
            setTimeout(() => {
                this.remove(id);
            }, duration);
        }
    }

    remove(id: string) {
        this.toasts = this.toasts.filter((t) => t.id !== id);
    }
}

export const toast = new ToastStore();