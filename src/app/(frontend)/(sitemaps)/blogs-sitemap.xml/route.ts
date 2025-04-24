import { getServerSideSitemap } from 'next-sitemap'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'

const getBlogsSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const SITE_URL =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      'https://example.com'

    const results = await payload.find({
      collection: 'blogs',
      overrideAccess: false,
      draft: false,
      depth: 0,
      limit: 1000,
      pagination: false,
      where: {
        _status: {
          equals: 'published',
        },
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    const dateFallback = new Date().toISOString()

    const sitemap = results.docs
      ? results.docs
          .filter((blog) => Boolean(blog?.slug))
          .map((blog) => ({
            loc: `${SITE_URL}/blogs/${blog?.slug}`,
            lastmod: blog.updatedAt || dateFallback,
          }))
      : []

    return sitemap
  },
  ['blogs-sitemap'],
  {
    tags: ['blogs-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getBlogsSitemap()

  return getServerSideSitemap(sitemap)
}
