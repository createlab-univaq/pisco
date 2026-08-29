export interface Analyst {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    createdAt: string;
}

export interface LoginResponse {
    token: string;
    expiresAt: string;
    analyst: Analyst;
}