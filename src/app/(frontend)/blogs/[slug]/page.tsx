import { PayloadRedirects } from '@/components/PayloadRedirects'
import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import configPromise from '@payload-config'
import { BlogHero } from '@/heros/BlogHero'
import RichText from '@/components/RichText'
import { RelatedBlogs } from '@/blocks/RelatedBlogs/Component'
import { generateMeta } from '@/utilities/generateMeta'
import { cache } from 'react'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const blogs = await payload.find({
    collection: 'blogs',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    select: {
      slug: true,
    },
  })

  const params = blogs.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Blog({ params: paramPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramPromise
  const url = '/blogs/' + slug
  const blog = await queryBlogBySlug({ slug })

  if (!blog) return <PayloadRedirects url={url} />

  return (
    <article className="pt-16 pb-16">
      <PageClient />

      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <BlogHero blog={blog} />

      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="container">
          <RichText className="max-w-[48rem] mx-auto" data={blog.content} enableGutter={false} />
          {blog.relatedBlogs && blog.relatedBlogs.length > 0 && (
            <RelatedBlogs
              className="mt-12 max-w-[52rem] lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[2fr]"
              docs={blog.relatedBlogs.filter((blog) => typeof blog === 'object')}
            />
          )}
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const blog = await queryBlogBySlug({ slug })

  return generateMeta({ doc: blog })
}

const queryBlogBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'blogs',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
