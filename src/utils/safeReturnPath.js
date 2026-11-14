// Only same-site paths are allowed as a post-login return target (blocks //evil.com, /\evil.com, control chars)
export function safeReturnPath(url) {
  return typeof url === "string" && /^\/(?![/\\])[^\u0000-\u001f]*$/.test(url)
    ? url
    : "/";
}
