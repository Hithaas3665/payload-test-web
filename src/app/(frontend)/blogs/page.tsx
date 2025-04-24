import type { Metadata } from 'next/types'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import React from 'react'
import PageClient from './page.client'
import { PageRange } from '@/components/PageRange'
import { CollectionArchive } from '@/components/CollectionArchive'
import { Pagination } from '@/components/Pagination'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const blogs = await payload.find({
    collection: 'blogs',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      meta: true,
    },
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Blogs</h1>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="blogs"
          currentPage={blogs.page}
          limit={12}
          totalDocs={blogs.totalDocs}
        />
      </div>

      {/* <CollectionArchive blogs={blogs.docs} /> */}

      <div className="container">
        {blogs.totalPages > 1 && blogs.page && (
          <Pagination page={blogs.page} totalPages={blogs.totalPages} />
        )}
      </div>
    </div>
  )
}

export function generateMeatadata(): Metadata {
  return {
    title: `Payload website template Blogs`,
  }
}
