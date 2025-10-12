import { glob } from 'astro/loaders'
import { defineCollection, z } from 'astro:content'

const blog = defineCollection({
  loader: glob({
    pattern: '*.md',
    base: './src/blog/',
  }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    created: z.date(),
    updated: z.date(),
  }),
})

export const collections = { blog }
