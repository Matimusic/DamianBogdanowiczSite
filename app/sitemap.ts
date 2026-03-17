import { MetadataRoute } from 'next'

// Ta linia jest niezbędna dla "output: export"
export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://damian-bogdanowicz-site.vercel.app/',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]
}