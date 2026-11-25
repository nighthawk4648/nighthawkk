import { getOptional } from "@/utils/getData";
import { buildLlmsTxt } from "@/utils/llms";
import { PLANS } from "@/utils/pricing";

export const revalidate = 86400;

export async function GET() {
  // Whatever is missing is left out: the file is still worth serving
  const [categories, settings, blogs] = await Promise.all([
    getOptional("categories/nav"),
    getOptional("general/application-settings"),
    getOptional("blogs/pages?page=1&limit=10&order=desc"),
  ]);

  const body = buildLlmsTxt({
    description: settings?.data?.site_description,
    categories: categories?.data || [],
    plans: PLANS,
    blogs: blogs?.data?.result || [],
    site: "https://www.sketchshaper.com",
  });

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
