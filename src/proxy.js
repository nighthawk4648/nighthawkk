import { NextResponse } from 'next/server';

export function proxy(request) {
    const { pathname, search } = request.nextUrl;
    const requestHost =
        request.headers.get('x-forwarded-host')?.split(',')[0].trim() ||
        request.headers.get('host') ||
        request.nextUrl.hostname;
    const hostname = requestHost.split(':')[0].toLowerCase();

    if (hostname === 'sketchshaper.com' || hostname === 'www.sketchshaper.com') {
        const forwardedProto = request.headers
            .get('x-forwarded-proto')
            ?.split(',')[0]
            .trim()
            .toLowerCase();
        const isHttps = forwardedProto
            ? forwardedProto === 'https'
            : request.nextUrl.protocol === 'https:';

        if (hostname !== 'www.sketchshaper.com' || !isHttps) {
            const canonicalUrl = request.nextUrl.clone();
            canonicalUrl.hostname = 'www.sketchshaper.com';
            canonicalUrl.protocol = 'https:';
            canonicalUrl.port = '';
            return NextResponse.redirect(canonicalUrl, 301);
        }
    }

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

    return NextResponse.next();
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

export default proxy;
