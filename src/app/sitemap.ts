import { baseHost } from '@/lib/site-meta';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: `${baseHost}/`,
      lastModified: new Date(),
    },
  ];
}
