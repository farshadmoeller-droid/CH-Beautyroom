import type { MetadataRoute } from 'next';
import { business } from '@/content/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const stand = new Date();
  return [
    { url: `${business.domain}/`, lastModified: stand, changeFrequency: 'monthly', priority: 1 },
    { url: `${business.domain}/impressum`, lastModified: stand, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${business.domain}/datenschutz`, lastModified: stand, changeFrequency: 'yearly', priority: 0.2 },
  ];
}
