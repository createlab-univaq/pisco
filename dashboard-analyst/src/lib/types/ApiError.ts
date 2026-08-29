export interface ApiError {
    title?: string;
    status?: number;
    detail?: string;
    instance?: string;
    errors?: Record<string, string>;
}