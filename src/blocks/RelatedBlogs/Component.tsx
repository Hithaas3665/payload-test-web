import React from 'react'
import clsx from 'clsx'
import { Blog } from '@/payload-types'

import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import RichText from '@/components/RichText'
import { BlogCard } from '@/components/BlogCard'

export type RelatedBlogsProps = {
  className?: string
  docs?: Blog[]
  introContent?: SerializedEditorState
}

export const RelatedBlogs: React.FC<RelatedBlogsProps> = (props) => {
  const { className, docs, introContent } = props

  return (
    <div className={clsx('lg:container', className)}>
      {introContent && <RichText data={introContent} enableGutter={false} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-stretch">
        {docs?.map((doc, index) => {
          if (typeof doc === 'string') return null

          return <BlogCard key={index} doc={doc} relationTo="blogs" />
        })}
      </div>
    </div>
  )
}
