import Extension from './extension';
import { getOptional } from '@/utils/getData';
import { buildPageMetadata } from '@/utils/seo';
import {
  JsonLd,
  generateBreadcrumbSchema,
  generateSoftwareAppSchema,
} from '@/utils/schema';

export const metadata = {
  ...buildPageMetadata({
    title: "SketchUp Extension & 3D Model Library",
    description:
      "Download the official Sketch shaper SketchUp extension (.rbz). Stream curated 3D architectural models and PBR textures directly into SketchUp.",
    pathname: "/extension",
    image:
      "https://www.sketchshaper.com/assets/extension/v1.jpg",
    imageAlt: "Sketch shaper SketchUp extension",
  }),
  keywords:
    "SketchUp plugin, SketchUp extension, 3D model library, download rbz, architectural visualization, free 3D models SketchUp, PBR textures SketchUp",
};

const extensionFaqs = [
  {
    q: 'Which SketchUp versions are compatible?',
    a: 'Sketch shaper is natively engineered and verified for SketchUp 2022, 2023, 2024, 2025, and 2026 across both Windows (10/11 64-bit) and macOS (including Apple Silicon M1, M2, M3, and M4 chips).',
  },
  {
    q: 'How do I install the .rbz extension file in SketchUp?',
    a: 'Do not unzip or extract the .rbz file. In SketchUp, go to Extensions > Extension Manager (or Window > Extension Manager in older releases), click "Install Extension" at the bottom, select "sketchshaper-1.5.0.rbz", and click Open. The toolbar docks automatically.',
  },
  {
    q: 'Are the 3D models and textures free for commercial rendering?',
    a: 'Yes. All assets inserted through the Sketch shaper extension come with full commercial visualization rights. You can use them in client presentations, architectural competitions, and commercial renders with zero licensing fees or attribution required.',
  },
  {
    q: 'Does the extension slow down SketchUp startup time or viewport FPS?',
    a: 'Not at all. The extension uses a lightweight Ruby wrapper (<5MB) that streams models and PBR textures on demand from cloud endpoints. It has zero measurable impact on SketchUp viewport frame rates or startup times.',
  },
  {
    q: 'Which render engines are supported for materials and models?',
    a: 'All SketchUp models and PBR materials work seamlessly with native SketchUp display, V-Ray, Enscape, Lumion, Twinmotion, D5 Render, and Thea Render out of the box.',
  },
  {
    q: 'Do I need an account or subscription to download?',
    a: 'No registration or subscription is required. Sketch shaper is 100% free forever. You can download the .rbz bundle directly and start inserting 3D models immediately without signing in.',
  },
];

export default async function Page() {
  const downloadData = await getOptional('extension-downloads/MyExtension');

  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: extensionFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  const softwareStructuredData = generateSoftwareAppSchema({
    name: 'Sketch shaper Extension for SketchUp',
    description:
      'Native SketchUp extension providing direct in-viewport streaming of 1,500+ curated 3D architectural models and calibrated PBR textures into SketchUp 2022-2026.',
    pathname: '/extension',
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Windows 10/11 64-bit, macOS 12+ (Apple Silicon & Intel)',
    softwareVersion: '1.5.0',
    fileFormat: 'application/x-ruby-zip (.rbz)',
    downloadUrl:
      'https://www.sketchshaper.com/assets/rbz/sketchshaper-1.5.0.rbz',
    image:
      'https://www.sketchshaper.com/assets/extension/v1.jpg',
    isFree: true,
  });

  const breadcrumbsSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'SketchUp Extension', url: '/extension' },
  ]);

  return (
    <>
      <JsonLd data={faqStructuredData} />
      <JsonLd data={softwareStructuredData} />
      <JsonLd data={breadcrumbsSchema} />
      <Extension initialData={downloadData} />
    </>
  );
}