// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/', // Tu wpisz foldery, których nie chcesz w Google
    },
    sitemap: 'https://damian-bogdanowicz-site.vercel.app/sitemap.xml',
  }
}