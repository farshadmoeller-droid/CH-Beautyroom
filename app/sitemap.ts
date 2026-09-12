import type { MetadataRoute } from 'next';
import { siteConfig } from '@/content/site-config';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const stand = new Date();

  return [
    { url: `${siteConfig.domain}/`, lastModified: stand, changeFrequency: 'monthly', priority: 1 },
    { url: `${siteConfig.domain}/galerie`, lastModified: stand, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteConfig.domain}/impressum`, lastModified: stand, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${siteConfig.domain}/datenschutz`, lastModified: stand, changeFrequency: 'yearly', priority: 0.2 },
  ];
}
