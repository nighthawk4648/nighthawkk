import Image from "next/image";
import Link from "next/link";
import { FiLayers, FiArrowRight } from "react-icons/fi";
import { buildAssetPath } from "@/utils/buildAssetPath";
import { getOriginalImageUrl } from "@/utils/imageUrl";
import { cleanText } from "@/utils/seo";
import { subCategoryPath } from "@/utils/paths";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action";

function subCategoryHref(sub) {
  const cat = sub?.category;
  return sub?.id && cat?.id ? subCategoryPath(cat, sub) : null;
}

/**
 * Editorial internal-linking section: a grid of compact asset cards.
 * Renders nothing when there are no assets.
 *
 * Every asset link goes through buildAssetPath (canonical 3-tier URL).
 */
const LinkedAssetsSection = ({ assets, title, eyebrow, className = "" }) => {
  const items = Array.isArray(assets) ? assets.filter((a) => a?.id) : [];
  if (items.length === 0) return null;

  return (
    <section
      aria-label={title}
      className={`bg-surface/30 backdrop-blur-2xl rounded-panel border border-white/[0.08] p-4 sm:p-5 shadow-2xl shadow-black/40 overflow-hidden relative space-y-4 ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-action/[0.02] pointer-events-none" />

      <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/[0.08] relative z-10">
        <h2 className="text-xs font-mono uppercase tracking-wider text-action font-semibold flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-action flex-shrink-0" />
          <FiLayers className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{title}</span>
          <span className="text-fg-secondary/60 font-normal">· {items.length}</span>
        </h2>
        {eyebrow && (
          <span className="hidden sm:inline text-[10px] font-mono text-fg-secondary/70 uppercase flex-shrink-0">
            {eyebrow}
          </span>
        )}
      </div>

      <ul className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2.5 relative z-10">
        {items.map((item) => {
          const name = cleanText(item.name, 60) || "Untitled asset";
          const isPaid = item.access_type === "paid";
          const href = buildAssetPath(item);
          const subName = item.sub_category?.name?.trim();
          const subHref = subCategoryHref(item.sub_category);

          return (
            <li
              key={item.id}
              className="group flex flex-col rounded-xl overflow-hidden border border-white/10 bg-canvas/60 shadow-md shadow-black/30 transition-all duration-300 hover:-translate-y-0.5 hover:border-action/40 hover:shadow-lg hover:shadow-action/5"
            >
              <Link
                href={href}
                tabIndex={-1}
                className="relative block aspect-[4/3] w-full bg-[radial-gradient(circle_at_50%_45%,rgba(79,219,134,0.10),transparent_70%)]"
              >
                {item.cover && (
                  <Image
                    src={getOriginalImageUrl(item.cover)}
                    alt={item.cover_alt?.trim() || name}
                    fill
                    className="object-contain p-2.5 drop-shadow-[0_6px_12px_rgba(0,0,0,0.6)] transition-transform duration-500 ease-out group-hover:scale-[1.45]"
                    sizes="(max-width: 640px) 50vw, 200px"
                  />
                )}
                <span
                  className={`absolute top-2 left-2 px-1.5 py-0.5 rounded-full text-[9px] font-semibold font-mono border backdrop-blur-sm ${
                    isPaid
                      ? "text-extension-tintFg border-extension-tintLine bg-extension-tintBg/90"
                      : "text-action border-action-tintLine bg-action-tintBg/90"
                  }`}
                >
                  {isPaid ? "PRO ✦" : "FREE"}
                </span>
              </Link>

              <div className="flex flex-1 flex-col gap-1.5 p-2 border-t border-white/[0.06]">
                <Link
                  href={href}
                  className={`text-xs text-fg font-medium leading-snug line-clamp-2 rounded-sm transition-colors hover:text-action ${focusRing}`}
                >
                  {name}
                </Link>
                {subName && subHref && (
                  <Link
                    href={subHref}
                    className={`self-end mt-auto inline-flex items-center gap-1 max-w-full text-xs font-mono text-fg-secondary rounded-sm transition-colors hover:text-action ${focusRing}`}
                  >
                    <span className="truncate">{subName}</span>
                    <FiArrowRight className="w-3 h-3 flex-shrink-0" />
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default LinkedAssetsSection;
