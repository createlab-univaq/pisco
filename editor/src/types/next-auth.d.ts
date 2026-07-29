import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    /** Google ID token forwarded to the backend as a bearer token */
    idToken?: string;
    /** Set when a refresh attempt failed, so the UI can force a re-login */
    error?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    idToken?: string;
    refreshToken?: string;
    /** Epoch ms at which `idToken` expires */
    idTokenExpires?: number;
    error?: string;
  }
}
