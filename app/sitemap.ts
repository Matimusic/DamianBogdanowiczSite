// app/sitemap.ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://damian-bogdanowicz-site.vercel.app/', // TWOJA DOMENA
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]
}