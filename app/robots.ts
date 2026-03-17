import { MetadataRoute } from 'next'

// Ta linia jest niezbędna dla "output: export"
export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://damian-bogdanowicz-site.vercel.app/sitemap.xml',
  }
}