import type { CollectionEntry } from 'astro:content'

export type Project = CollectionEntry<'projects'>

export type ProjectCategory =
  | 'neovim'
  | 'web'
  | 'systems'
  | 'iot'
  | 'devtools'
  | 'config'
  | 'deeplearning'
  | 'geek'

export type ProjectStatus = 'active' | 'maintained' | 'archived'

export const categoryOrder: ProjectCategory[] = [
  'neovim',
  'web',
  'systems',
  'iot',
  'devtools',
  'deeplearning',
  'geek',
]
