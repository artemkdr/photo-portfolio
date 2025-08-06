# Google Photos Integration

This doc### Option 2: Public Album URL (Implemented)

For truly public albums, you can use the public URL approach:

```typescript
const photos = await fetchPhotos('google-photos', 300, {
    publicAlbumUrl: 'https://photos.google.com/share/your-public-album-url',
});
```

**How it works**:

- Fetches the public album page HTML
- Extracts photo URLs using multiple parsing methods:
    1. JSON data extraction from page scripts
    2. Regex pattern matching for image URLs
    3. HTML attribute parsing
- Returns high-quality image URLs (w2048-h2048)

**Limitations**:

- Relies on Google Photos' HTML structure (may break if Google changes their format)
- Less reliable than the official API
- Cannot access creation timestamps reliably
- May be subject to rate limiting
- Only works with truly public/shared albums

**Supported URL formats**:

- `https://photos.google.com/share/[album-id]`
- `https://photos.app.goo.gl/[short-url]`
- Standard Google Photos album linksins how to integrate Google Photos as a data source for your photo portfolio.

## Setup Options

### Option 1: Google Photos API (Recommended)

1. **Enable Google Photos API**:
    - Go to [Google Cloud Console](https://console.cloud.google.com/)
    - Create a new project or select an existing one
    - Enable the "Photos Library API"
    - Create credentials (API key)

2. **Get Album ID**:
    - Create a shared album in Google Photos
    - Share the album and get the shareable link
    - Extract the album ID from the URL (use the `extractAlbumIdFromUrl` helper)

3. **Configure in your app**:

    ```typescript
    // In app.config.ts
    googlePhotos: {
      apiKey: 'your-google-photos-api-key',
      albumId: 'your-album-id',
    }
    ```

4. **Usage**:
    ```typescript
    const photos = await fetchPhotos('google-photos', 300, {
        apiKey: 'your-api-key',
        albumId: 'your-album-id',
    });
    ```

### Option 2: Public Album URL (Limited)

For truly public albums, you can try using the public URL approach:

```typescript
const photos = await fetchPhotos('google-photos', 300, {
    publicAlbumUrl: 'https://photos.google.com/share/your-public-album-url',
});
```

**Note**: This method has limitations and may not work reliably due to Google's anti-scraping measures.

## Environment Variables

You can also use environment variables:

```bash
# .env.local
GOOGLE_PHOTOS_API_KEY=your_api_key_here
GOOGLE_PHOTOS_ALBUM_ID=your_album_id_here
GOOGLE_PHOTOS_PUBLIC_URL=your_public_album_url_here
```

## Rate Limits

Google Photos API has rate limits:

- 10,000 requests per day (default quota)
- 100 requests per 100 seconds per user

## Image Quality

The implementation fetches high-quality images using the `=w2048-h2048` parameter. You can modify this in the `fetchFromGooglePhotosAPI` function if needed.

## Troubleshooting

1. **API Key Issues**: Make sure your API key has the Photos Library API enabled
2. **Album Access**: Ensure the album is shared and the album ID is correct
3. **CORS Issues**: Google Photos API should work from server-side code (Next.js API routes)
4. **Rate Limits**: Implement caching to avoid hitting rate limits

## Example Usage

```typescript
// Update your data source in app.config.ts
export const appConfig = {
    // ... other config
    dataSource: 'google-photos', // Change from 'blob' or 'fs'
    googlePhotos: {
        apiKey: process.env.GOOGLE_PHOTOS_API_KEY,
        albumId: process.env.GOOGLE_PHOTOS_ALBUM_ID,
    },
};
```

## Security Considerations

- Never expose your API key in client-side code
- Use environment variables for sensitive data
- Consider implementing server-side caching to reduce API calls
- Monitor your API usage in Google Cloud Console
