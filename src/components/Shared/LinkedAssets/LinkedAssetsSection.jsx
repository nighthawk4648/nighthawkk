import Image from "next/image";
import Link from "next/link";
import { FiLayers } from "react-icons/fi";
import { buildAssetPath } from "@/utils/buildAssetPath";
import { getOriginalImageUrl } from "@/utils/imageUrl";
import { cleanText } from "@/utils/seo";

/**
 * Editorial internal-linking section: a grid of asset cards.
 * Renders nothing when there are no assets.
 *
 * Every link goes through buildAssetPath (canonical 3-tier URL).
 */
const LinkedAssetsSection = ({ assets, title, eyebrow, className = "" }) => {
  const items = Array.isArray(assets) ? assets.filter((a) => a?.id) : [];
  if (items.length === 0) return null;

  return (
    <section
      aria-label={title}
      className={`bg-surface/30 backdrop-blur-2xl rounded-panel border border-white/[0.08] p-5 shadow-2xl shadow-black/40 overflow-hidden relative space-y-4 ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-action/[0.02] pointer-events-none" />

      <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/[0.08] relative z-10">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-action flex-shrink-0" />
          <h2 className="text-xs font-mono uppercase tracking-wider text-action font-semibold flex items-center gap-2">
            <FiLayers className="w-3.5 h-3.5 flex-shrink-0" />
            <span>
              {title} ({items.length})
            </span>
          </h2>
        </div>
        {eyebrow && (
          <span className="hidden sm:inline text-[10px] font-mono text-fg-secondary/70 uppercase">
            {eyebrow}
          </span>
        )}
      </div>

      <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 relative z-10">
        {items.map((item) => {
          const name = cleanText(item.name, 40) || "Untitled asset";
          const isPaid = item.access_type === "paid";
          const subName = item.sub_category?.name;

          return (
            <li key={item.id}>
              <Link
                href={buildAssetPath(item)}
                className="group block rounded-xl overflow-hidden border border-white/10 bg-canvas/60 hover:border-action/40 transition-colors duration-200"
              >
                <div className="relative aspect-[4/3] w-full bg-canvas">
                  {item.cover && (
                    <Image
                      src={getOriginalImageUrl(item.cover)}
                      alt={item.cover_alt?.trim() || name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 50vw, 200px"
                    />
                  )}
                  <span
                    className={`absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold font-mono border backdrop-blur-sm ${
                      isPaid
                        ? "text-extension border-extension-tintLine bg-extension-tintBg/80"
                        : "text-action border-action-tintLine bg-action-tintBg"
                    }`}
                  >
                    {isPaid ? "PRO" : "FREE"}
                  </span>
                </div>
                <div className="p-2.5 space-y-0.5">
                  <p className="text-xs text-fg font-medium leading-snug line-clamp-2">
                    {name}
                  </p>
                  {subName && (
                    <p className="text-[10px] font-mono text-fg-secondary truncate">
                      {subName}
                    </p>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default LinkedAssetsSection;
