import { categoryPath, subCategoryPath, blogPath } from "./paths.js";
import { cleanText } from "./seo.js";
import { yearlyPrice } from "./pricing.js";

const FALLBACK_DESCRIPTION = "Free and pro 3D models, textures, and plugins for SketchUp.";
const MAX_ARTICLES = 10;

// "- [Name](url): N models"; the count is left out when the data has none
const link = (name, url, count) =>
  `- [${name}](${url})${count > 0 ? `: ${count.toLocaleString("en-US")} models` : ""}`;

/**
 * Builds the llms.txt Markdown file that tells AI tools what the site offers.
 * categories: the categories/nav data, plans: PLANS, blogs: blog posts, site: origin without trailing slash.
 */
export function buildLlmsTxt({ description, categories = [], plans = [], blogs = [], site }) {
  const lines = [
    "# Sketch shaper",
    "",
    `> ${cleanText(description, 300) || FALLBACK_DESCRIPTION}`,
    "",
    "Sketch shaper is a library of SketchUp 3D models. Many models are free to download, PRO models come with a PRO membership, and the free SketchUp extension imports them directly into SketchUp.",
    "",
    "## Library",
    "",
  ];

  for (const cat of categories) {
    if (!cat?.name) continue;
    const subs = (cat.sub_categories || []).filter((sub) => sub?.name);
    const total = subs.reduce((sum, sub) => sum + (sub._count?.assets || 0), 0);
    lines.push(link(cat.name, `${site}${categoryPath(cat)}`, total));
    for (const sub of subs) {
      lines.push(`  ${link(sub.name, `${site}${subCategoryPath(cat, sub)}`, sub._count?.assets || 0)}`);
    }
  }

  lines.push("", "## Key pages", "");
  lines.push(`- [Extension](${site}/extension): free SketchUp extension to browse and import models`);
  lines.push(`- [Pricing](${site}/pricing): membership plans`);
  for (const plan of plans) {
    const includes = plan.features?.length ? ` (${plan.features.join("; ")})` : "";
    lines.push(`  - ${plan.name}: $${plan.monthly}/month or $${yearlyPrice(plan.monthly)}/year${includes}`);
  }
  lines.push(
    `- [License](${site}/license)`,
    `- [About](${site}/about-us)`,
    `- [Contact](${site}/contact)`,
    `- [Blog](${site}/blog)`,
    "",
    "## Latest articles",
    "",
  );

  for (const blog of blogs.filter((b) => b?.title).slice(0, MAX_ARTICLES)) {
    lines.push(`- [${cleanText(blog.title, 150)}](${site}${blogPath(blog)})`);
  }

  return `${lines.join("\n")}\n`;
}
