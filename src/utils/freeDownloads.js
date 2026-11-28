export const FREE_DOWNLOADS = 1;
const KEY = "ss_free_downloads";

// Storage may be null or throw (Safari private, blocked): then nothing is counted and nobody is blocked
export function freeDownloadsUsed(storage) {
  try {
    const n = parseInt(storage.getItem(KEY), 10);
    return n > 0 ? n : 0;
  } catch {
    return 0;
  }
}

export function canDownloadFree(storage) {
  return freeDownloadsUsed(storage) < FREE_DOWNLOADS;
}

export function countFreeDownload(storage) {
  try {
    storage.setItem(KEY, String(freeDownloadsUsed(storage) + 1));
  } catch {
    // storage unavailable: skip counting
  }
}
