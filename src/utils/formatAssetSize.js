/**
 * Formats the file size of a 3D asset dynamically.
 * Prioritizes actual byte size from the uploaded file when available,
 * or validates the legacy text string if it has proper size units.
 * Eliminates placeholders ("-", "free size", "random", "mini") and dimension strings ("4000 X 4000").
 *
 * @param {Object} asset - The asset object containing `size` and optionally `file: { file_size }`.
 * @returns {string} Human-readable size string (e.g. "14.8 MB", "365 KB", "Native .SKP")
 */
export function formatAssetSize(asset) {
  if (!asset) return "Native .SKP";

  const sizeStr = asset.size ? String(asset.size).trim() : "";
  const rawBytes = Number(asset.file?.file_size || 0);

  // Check if sizeStr has numbers and a standard storage unit (e.g. "365.96 KB", "2.85 MB", "12 MB")
  const hasValidUnit = /\d+(?:\.\d+)?\s*(?:Bytes|B|KB|MB|GB)/i.test(sizeStr);

  // Detect placeholders or non-size strings like "-", "free size", "random", "mini", dimensions like "4000 X 4000", or pure words without digits
  const isInvalidPlaceholder =
    !sizeStr ||
    sizeStr === "-" ||
    /free size|random|mini/i.test(sizeStr) ||
    /^\d+\s*[xX*×]\s*\d+/.test(sizeStr) || // dimensions e.g. "4000 X 4000"
    !/\d/.test(sizeStr);

  // If we have actual uploaded file bytes, and sizeStr is either invalid, a dimension, or lacks units
  if (rawBytes > 0 && (isInvalidPlaceholder || !hasValidUnit)) {
    if (rawBytes >= 1024 * 1024) {
      return `${(rawBytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    return `${Math.round(rawBytes / 1024)} KB`;
  }

  // If sizeStr is already a valid formatted size (e.g. "365.96 KB", "2.85 MB"), use it
  if (hasValidUnit) {
    return sizeStr;
  }

  // If size is a clean raw number string like "12.5" or 12.5
  if (!isNaN(Number(sizeStr)) && Number(sizeStr) > 0) {
    return `${Number(sizeStr)} MB`;
  }

  // If raw bytes exist as fallback
  if (rawBytes > 0) {
    if (rawBytes >= 1024 * 1024) {
      return `${(rawBytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    return `${Math.round(rawBytes / 1024)} KB`;
  }

  // If sizeStr exists and is not a placeholder/dimension
  if (sizeStr && !isInvalidPlaceholder) {
    return sizeStr;
  }

  return "Native .SKP";
}

export default formatAssetSize;

