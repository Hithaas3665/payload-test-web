import type { Post, ArchiveBlock as ArchiveBlockProps, Blog } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import RichText from '@/components/RichText'

import { CollectionArchive } from '@/components/CollectionArchive'

export const ArchiveBlock: React.FC<
  ArchiveBlockProps & {
    id?: string
  }
> = async (props) => {
  const {
    id,
    categories,
    introContent,
    limit: limitFromProps,
    populateBy,
    selectedDocs,
    relationTo,
  } = props

  const limit = limitFromProps || 3
  const payload = await getPayload({ config: configPromise })

  let posts: Post[] = []
  let blogs: Blog[] = []

  const flattenedCategories = categories?.map((category) =>
    typeof category === 'object' ? category.id : category,
  )

  const collectionToQuery = relationTo || 'posts'

  if (populateBy === 'collection') {
    const fetchedDocs = await payload.find({
      collection: collectionToQuery,
      depth: 1,
      limit,
      ...(flattenedCategories?.length
        ? {
            where: {
              categories: {
                in: flattenedCategories,
              },
            },
          }
        : {}),
    })

    // posts = fetchedPosts.docs
    if (collectionToQuery === 'blogs') {
      blogs = fetchedDocs.docs as Blog[]
    } else {
      posts = fetchedDocs.docs as Post[]
    }
  } else if (populateBy === 'selection' && selectedDocs?.length) {
    const filtered = selectedDocs
      .map((item) => (typeof item.value === 'object' ? item.value : null))
      .filter(Boolean)

    if (selectedDocs[0]?.relationTo === 'blogs') {
      blogs = filtered as Blog[]
    } else {
      posts = filtered as Post[]
    }
  }

  return (
    <div className="my-16" id={`block-${id}`}>
      {introContent && (
        <div className="container mb-16">
          <RichText className="ms-0 max-w-[48rem]" data={introContent} enableGutter={false} />
        </div>
      )}
      <CollectionArchive posts={posts} blogs={blogs} />
    </div>
  )
}
