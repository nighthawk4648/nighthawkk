import React from "react";

const COMPATIBLE_TOOLS = [
  "SketchUp",
  "V-Ray",
  "Enscape",
  "D5 Render",
  "Twinmotion",
  "Blender",
];

export default function CompatibilitySection() {
  return (
    <section className="py-12 border-t border-line w-full px-4 md:px-[0.5in]">
      <div className="w-full text-center">
        <span className="text-xs font-mono uppercase tracking-wider text-fg-secondary mb-6 block">
          Compatible with
        </span>
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-70 hover:opacity-100 transition-opacity">
          {COMPATIBLE_TOOLS.map((tool) => (
            <span
              key={tool}
              className="font-mono text-sm tracking-wider text-fg-secondary hover:text-fg transition-colors select-none"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
