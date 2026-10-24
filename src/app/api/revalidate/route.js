import { revalidateTag, revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import crypto from "crypto";

function constantTimeCompare(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) {
    const aHash = crypto.createHash("sha256").update(aBuf).digest();
    const bHash = crypto.createHash("sha256").update(bBuf).digest();
    crypto.timingSafeEqual(aHash, bHash);
    return false;
  }
  return crypto.timingSafeEqual(aBuf, bBuf);
}

export async function POST(request) {
  const authHeader = request.headers.get("authorization");
  const customHeader = request.headers.get("x-revalidate-secret");
  let token = "";
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.slice(7).trim();
  } else if (customHeader) {
    token = customHeader.trim();
  }

  const expectedSecret = process.env.REVALIDATION_SECRET;
  if (!expectedSecret || !token || !constantTimeCompare(token, expectedSecret)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let body = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const tags = Array.isArray(body.tags)
    ? body.tags
    : body.tag
    ? [body.tag]
    : [];
  const paths = Array.isArray(body.paths)
    ? body.paths
    : body.path
    ? [body.path]
    : [];

  if (tags.length === 0 && paths.length === 0) {
    return NextResponse.json(
      { message: "Missing tags or paths in payload" },
      { status: 400 }
    );
  }

  const revalidatedTags = [];
  for (const tag of tags) {
    if (typeof tag === "string" && tag.trim()) {
      const cleanTag = tag.trim();
      try {
        // Next.js 16+ immediate expiry cache profile
        revalidateTag(cleanTag, { expire: 0 });
      } catch {
        // Fallback for older signatures
        revalidateTag(cleanTag);
      }
      revalidatedTags.push(cleanTag);
    }
  }

  const revalidatedPaths = [];
  for (const path of paths) {
    if (typeof path === "string" && path.trim()) {
      const cleanPath = path.trim();
      try {
        revalidatePath(cleanPath);
        revalidatedPaths.push(cleanPath);
      } catch (err) {
        console.warn(`[revalidate] Failed path: ${cleanPath}`, err.message);
      }
    }
  }

  return NextResponse.json({
    revalidated: true,
    tags: revalidatedTags,
    paths: revalidatedPaths,
    now: Date.now(),
  });
}
