import type { Analyst } from "./Analyst";

export interface LoginResponse {
    token: string;
    expiresAt: string;
    analyst: Analyst;
}