'use server';

/**
 * Google Photos data source implementation
 *
 * This implementation supports two approaches:
 * 1. Google Photos API (recommended) - requires API key and album ID
 * 2. Public album URL parsing (fallback) - works with public shared albums
 */

interface GooglePhotosConfig {
    apiKey?: string;
    albumId?: string;
    publicAlbumUrl?: string;
}

interface GooglePhotosItem {
    id: string;
    baseUrl: string;
    filename: string;
    mediaMetadata: {
        creationTime: string;
        width: string;
        height: string;
    };
}

interface GooglePhotosApiResponse {
    mediaItems: GooglePhotosItem[];
    nextPageToken?: string;
}

/**
 * Fetch photos from Google Photos API
 * Requires Google Photos API key and shared album ID
 */
async function fetchFromGooglePhotosAPI(config: GooglePhotosConfig) {
    if (!config.apiKey || !config.albumId) {
        throw new Error('Google Photos API key and album ID are required');
    }

    const photos = [];
    let nextPageToken = '';

    try {
        do {
            const url = new URL(
                'https://photoslibrary.googleapis.com/v1/mediaItems:search'
            );
            url.searchParams.append('key', config.apiKey);

            const requestBody = {
                albumId: config.albumId,
                pageSize: 100,
                ...(nextPageToken && { pageToken: nextPageToken }),
            };

            const response = await fetch(url.toString(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                throw new Error(
                    `Google Photos API error: ${response.status} ${response.statusText}`
                );
            }

            const data: GooglePhotosApiResponse = await response.json();

            if (data.mediaItems) {
                for (const item of data.mediaItems) {
                    photos.push({
                        src: `${item.baseUrl}=w2048-h2048`, // High quality version
                        name: encodeURIComponent(item.filename || item.id),
                        alt: item.filename || `Photo ${item.id}`,
                        created: new Date(item.mediaMetadata.creationTime),
                        googlePhotosId: item.id,
                    });
                }
            }

            nextPageToken = data.nextPageToken || '';
        } while (nextPageToken);
    } catch (error) {
        console.error('Failed to fetch photos from Google Photos API:', error);
        throw error;
    }

    return photos;
}

/**
 * Fallback method: Parse public Google Photos album URL
 * This is less reliable but works for truly public albums
 */
async function fetchFromPublicAlbum(publicAlbumUrl: string) {
    try {
        // Ensure the URL is a valid Google Photos public album URL
        if (
            !publicAlbumUrl.includes('photos.google.com') &&
            !publicAlbumUrl.includes('photos.app.goo.gl')
        ) {
            throw new Error('Invalid Google Photos album URL');
        }

        // Fetch the album page HTML
        const response = await fetch(publicAlbumUrl, {
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            },
        });

        if (!response.ok) {
            throw new Error(
                `Failed to fetch album page: ${response.status} ${response.statusText}`
            );
        }

        const html = await response.text();

        // Extract photo data from the page
        const photos = extractPhotosFromHtml(html);

        if (photos.length === 0) {
            console.warn(
                'No photos found in the public album. The album might be private or the URL format has changed.'
            );
        }

        return photos;
    } catch (error) {
        console.error(
            'Failed to fetch from public Google Photos album:',
            error
        );
        return [];
    }
}

/**
 * Extract photo information from Google Photos album HTML
 */
function extractPhotosFromHtml(html: string) {
    const photos = [] as {
        src: string;
        name: string;
        alt: string;
        created: Date;
        googlePhotosId?: string;
    }[];

    try {
        // Look for image URLs in the HTML using regex patterns
        const imagePatterns = [
            // Standard image URLs
            /https:\/\/lh3\.googleusercontent\.com\/pw\/[a-zA-Z0-9_-]+/g,
        ];

        const foundUrls = new Set<string>();

        for (const pattern of imagePatterns) {
            const matches = html.match(pattern);
            if (matches) {
                matches.forEach((url) => foundUrls.add(url));
            }
        }

        // Convert URLs to photo objects
        Array.from(foundUrls).forEach((url, index) => {
            // Extract filename or create a default one
            const urlParts = url.split('/');
            const lastPart = urlParts[urlParts.length - 1];
            const filename = lastPart.includes('=')
                ? `photo-${index + 1}.jpg`
                : lastPart || `photo-${index + 1}.jpg`;

            photos.push({
                src: url.includes('=') ? url : `${url}=w1600-h1200`, // Ensure high quality
                name: encodeURIComponent(filename),
                alt: filename,
                created: new Date(), // We can't get creation time from public albums reliably
                googlePhotosId: extractIdFromUrl(url) || `public-${index}`,
            });
        });
    } catch (error) {
        console.error('Error extracting photos from HTML:', error);
    }

    return photos;
}

/**
 * Extract photo ID from Google Photos URL
 */
function extractIdFromUrl(url: string): string | null {
    const match = url.match(/\/([a-zA-Z0-9_-]{20,})/);
    return match ? match[1] : null;
}

/**
 * Main function to fetch photos from Google Photos
 */
export async function fetchPhotosFromGooglePhotos(config: GooglePhotosConfig) {
    if (!config.apiKey && !config.publicAlbumUrl) {
        console.warn(
            'No Google Photos configuration provided. Please provide either API key + album ID or public album URL.'
        );
        return [];
    }

    let photos: Array<{
        src: string;
        name: string;
        alt: string;
        created: Date;
        googlePhotosId?: string;
    }> = [];

    // Try API approach first (recommended)
    if (config.apiKey && config.albumId) {
        try {
            photos = await fetchFromGooglePhotosAPI(config);
        } catch (error) {
            console.error(
                'Google Photos API failed, trying fallback method:',
                error
            );
        }
    }

    // Fallback to public album parsing if API fails or isn't configured
    if (photos.length === 0 && config.publicAlbumUrl) {
        photos = await fetchFromPublicAlbum(config.publicAlbumUrl);
    }

    if (photos.length === 0) {
        console.warn(
            'No photos found from Google Photos. Check your configuration.'
        );
        return [];
    }

    // Sort by creation time (newest first)
    photos.sort((a, b) => -1 * (a.created.getTime() - b.created.getTime()));

    return photos;
}
