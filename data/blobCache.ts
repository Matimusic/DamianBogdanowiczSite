// Shared in-memory blob URL cache.
// Populated during the preload phase in app/page.tsx,
// consumed by video elements in Hero.tsx (ClipItem).
// Blob URLs are kept alive for the session so video elements can loop/seek freely.
export const blobUrlCache = new Map<string, string>();
