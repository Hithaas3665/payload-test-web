import { CollectionAfterChangeHook } from 'payload'
import type { Blog } from '../../../payload-types'
import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateBlog: CollectionAfterChangeHook<Blog> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/blogs/${doc.slug}`

      payload.logger.info(`Revalidating blog at path: ${path}`)

      revalidatePath(path)
      revalidateTag('blogs-sitemap')
    }

    // If the blog was previously published, we need to revalidate the old path
    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = `/blogs/${previousDoc.slug}`

      payload.logger.info(`Revalidating old blog at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidateTag('blogs-sitemap')
    }
  }
  return doc
}
