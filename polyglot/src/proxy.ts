import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add paths that do NOT require authentication
const publicPaths = ['/login'];

// FIX: Changed function name from "middleware" to "proxy"
export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Allow public paths
    if (publicPaths.some(path => pathname.startsWith(path))) {
        return NextResponse.next();
    }

    // 2. Check for our auth token cookie
    const token = request.cookies.get('token');

    // 3. If no token exists, redirect instantly to login
    if (!token) {
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    // Only run proxy on UI pages, ignore API routes and static files
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};