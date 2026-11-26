// Phones: screens below Tailwind's sm breakpoint (640px)
export const PHONE_QUERY = "(max-width: 639px)";

// Size attributes for the AdSense <ins>. A fixed size is Google's "exact size per screen width" option,
// which requires leaving out data-ad-format and data-full-width-responsive.
export function insSizeProps({ format, fullWidthResponsive, fixedSize = null }) {
  if (fixedSize) {
    return {
      style: { display: "inline-block", width: `${fixedSize.width}px`, height: `${fixedSize.height}px` },
    };
  }
  return {
    style: { display: "block", width: "100%", minWidth: format === "fluid" ? "250px" : undefined },
    "data-ad-format": format,
    "data-full-width-responsive": fullWidthResponsive ? "true" : "false",
  };
}
