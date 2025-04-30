import type { Metadata } from 'next/types'
import configPromise from '@payload-config'
import { getPayload, Where } from 'payload'
import React from 'react'

import { CollectionArchive } from '@/components/CollectionArchive'
import PageClient from './page.client'
import { Search } from '@/search/Component'
import { CardPostData } from '@/components/Card'
import { CardBlogData } from '@/components/BlogCard'

type Args = {
  searchParams: Promise<{
    q: string
  }>
}

export default async function Page({ searchParams: searchParamsPromise }: Args) {
  const { q: query } = await searchParamsPromise
  const payload = await getPayload({ config: configPromise })

  const limit = 12

  const buildQueryFilter = (query: string) => {
    if (!query) return {}

    return {
      where: {
        or: [
          { title: { like: query } },
          { slug: { like: query } },
          { 'meta.description': { like: query } },
          { 'meta.title': { like: query } },
        ] as Where[], // Cast to mutable type to match the expected structure
      },
    }
  }

  const queryFilter = buildQueryFilter(query)

  const [postsRes, blogsRes] = await Promise.all([
    payload.find({
      collection: 'posts',
      depth: 1,
      limit,
      select: {
        title: true,
        slug: true,
        categories: true,
        meta: true,
      },
      pagination: false,
      ...queryFilter,
    }),
    payload.find({
      collection: 'blogs',
      depth: 1,
      limit,
      select: {
        title: true,
        slug: true,
        meta: true,
      },
      pagination: false,
      ...queryFilter,
    }),
  ])

  const posts = postsRes.docs as CardPostData[]
  const blogs = blogsRes.docs as CardBlogData[]

  const hasResults = posts.length > 0 || blogs.length > 0

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none text-center">
          <h1 className="mb-8 lg:mb-16">Search</h1>

          <div className="max-w-[50rem] mx-auto">
            <Search />
          </div>
        </div>
      </div>

      {hasResults ? (
        <CollectionArchive posts={posts} blogs={blogs} />
      ) : (
        <div className="container">No results found.</div>
      )}
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Payload Website Template Search`,
  }
}
