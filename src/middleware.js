import { NextResponse } from 'next/server';

export function middleware(request) {
    const { pathname, search } = request.nextUrl;

    // Check if URL has _rsc parameter
    if (search.includes('_rsc=')) {
        const response = NextResponse.next();

        // Add X-Robots-Tag header to prevent indexing of RSC URLs
        response.headers.set('X-Robots-Tag', 'noindex, nofollow');

        return response;
    }

    // Block direct access to api.php if it exists
    if (pathname === '/api.php') {
        return new NextResponse('Not Found', { status: 404 });
    }

    // Add canonical URL header for all pages
    const response = NextResponse.next();
    const canonicalUrl = `https://www.sketchshaper.com${pathname}`;
    response.headers.set('Link', `<${canonicalUrl}>; rel="canonical"`);

    return response;
}

// Configure which routes the middleware should run on
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
