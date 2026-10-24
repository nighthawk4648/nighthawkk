/**
 * SEO Component to add canonical URLs and prevent duplicate content issues
 * Use this in your page components to ensure proper canonical tags
 */

import { stripHtml } from "@/utils/sanitizeHtml";

export function generateCanonicalUrl(pathname) {
    // Remove trailing slashes
    const cleanPath = pathname.replace(/\/$/, '') || '/';

    // Remove any query parameters (especially _rsc)
    const pathWithoutQuery = cleanPath.split('?')[0];

    return `https://www.sketchshaper.com${pathWithoutQuery}`;
}

export function getCleanMetadata(pathname, metadata = {}) {
    const canonicalUrl = generateCanonicalUrl(pathname);

    const cleanTitle = metadata.title ? stripHtml(metadata.title, 60) : undefined;
    const cleanDescription = metadata.description ? stripHtml(metadata.description, 160) : undefined;

    return {
        ...metadata,
        ...(cleanTitle ? { title: cleanTitle } : {}),
        ...(cleanDescription ? { description: cleanDescription } : {}),
        alternates: {
            canonical: canonicalUrl,
            ...metadata.alternates,
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
            ...metadata.robots,
        },
    };
}
