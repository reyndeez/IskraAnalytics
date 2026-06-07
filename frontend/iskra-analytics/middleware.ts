import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const role = request.cookies.get('role')?.value;
    
    const { pathname } = request.nextUrl;

    if (!token) {
        if (pathname.startsWith('/admin') || pathname.startsWith('/coach') || pathname.startsWith('/user')) {
            return NextResponse.redirect(new URL('/?auth=required', request.url));
        }
    }

    if (token && role) {
        if (pathname.startsWith('/admin') && role !== 'admin') {
            return NextResponse.redirect(new URL('/', request.url));
        }

        if (pathname.startsWith('/coach') && role !== 'coach') {
            return NextResponse.redirect(new URL('/', request.url));
        }

        if (pathname.startsWith('/user') && role !== 'user') {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/coach/:path*',
        '/user/:path*',
    ],
};