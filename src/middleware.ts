import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");

// Define paths that do not require authentication
const publicPaths = [
    '/login',
    '/register',
    '/api/auth/login',
    '/api/health',
    '/api/doc',
    '/docs'
];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if path is public
    if (publicPaths.some(path => pathname.startsWith(path))) {
        return NextResponse.next();
    }

    // Check for token in cookies or headers
    // For API routes, usually Authorization header. For Page routes, cookies.
    // We'll prioritize Authorization header for flexibility, then cookies.
    let token = request.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
        // Try to get from cookie (conventional for Next.js app router frontend)
        // Note: You need to set the cookie on login for this to work automatically
        const cookie = request.cookies.get('token');
        // OR whatever you name your cookie. Let's assume 'token' or 'accessToken'
        token = cookie?.value;
    }

    if (!token) {
        // If it's an API request, return 401
        if (pathname.startsWith('/api')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        // Otherwise redirect to login
        return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
        // Verify Token
        const { payload } = await jwtVerify(token, JWT_SECRET);

        // Role-Based Redirects (Portal vs Dashboard)
        const role = payload.role as string; // Assuming role name is in payload, or we fetch it. 
        // NOTE: In previous steps we used roleId. If payload has role name, good. 
        // If not, we might need to fetch it or store it in token.
        // Let's assume for now the token payload has 'role' name or we check based on path.

        // Simple Path Protection
        if (pathname.startsWith('/dashboard') && role === 'PATIENT') {
            return NextResponse.redirect(new URL('/portal', request.url));
        }

        if (pathname.startsWith('/portal') && role !== 'PATIENT') {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }

        if (pathname.startsWith('/dashboard') && role === 'DOCTOR') {
            return NextResponse.redirect(new URL('/doctor', request.url));
        }

        if (pathname.startsWith('/doctor') && role !== 'DOCTOR') {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }

        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-user-id', payload.userId as string);
        requestHeaders.set('x-clinic-id', payload.clinicId as string);
        requestHeaders.set('x-user-role', payload.roleId as string);

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
    } catch (error) {
        // If verification fails
        if (pathname.startsWith('/api')) {
            return NextResponse.json({ error: 'Invalid Token' }, { status: 401 });
        }
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
