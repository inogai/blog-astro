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

const projects = defineCollection({
  loader: glob({
    pattern: '*.md',
    base: './src/projects/',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    techStack: z.array(z.string()),
    category: z.enum([
      'neovim', // Neovim & Editor
      'web', // Web Applications
      'systems', // Systems & CLI
      'iot', // IoT & Hardware
      'devtools', // DevTools & Infrastructure
      'deeplearning', // Deep Learning & AI
      'geek', // Geek & Fun Projects
    ]),
    github: z.string().url().optional(),
    demo: z.string().url().optional(),
    image: z.string().optional(),
    featured: z.boolean().default(false),
    status: z.enum(['ongoing', 'maintained', 'archived']).default('maintained'),
    order: z.number().default(0), // For manual ordering within category
  }),
})

export const collections = { blog, projects }
