import { cn } from '@/utilities/ui'
import React from 'react'

import { Card, CardPostData } from '@/components/Card'
import { BlogCard, CardBlogData } from '../BlogCard'

export type Props = {
  posts: CardPostData[]
  blogs: CardBlogData[]
}

export const CollectionArchive: React.FC<Props> = ({ posts, blogs }) => {
  return (
    <div className={cn('container')}>
      <div>
        <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-y-4 gap-x-4 lg:gap-y-8 lg:gap-x-8 xl:gap-x-8">
          {posts?.map((post, index) => (
            // if (typeof result === 'object' && result !== null) {
            //   return (
            <div className="col-span-4" key={index}>
              <Card className="h-full" doc={post} relationTo="posts" showCategories />
            </div>
            //   )
            // }

            // return null
          ))}

          {blogs?.map((blog, index) => (
            <div className="col-span-4" key={index}>
              <BlogCard className="h-full" doc={blog} relationTo="blogs" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
