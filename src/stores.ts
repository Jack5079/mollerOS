import { Writable, writable } from 'svelte/store'
import type { Session } from './types'
import type { commit } from 'isomorphic-git'
export const sessions: Writable<Session[]> = writable([])
export const wallpaper: Writable<string> = writable(
  localStorage.getItem('wallpaper') || 'vortex'
)
wallpaper.subscribe((url) => localStorage.setItem('wallpaper', url))
export const author: Writable<
  NonNullable<Required<Parameters<typeof commit>[0]['author']>>
> = writable(
  JSON.parse(localStorage.getItem('gitauthor') || 'false') || {
    name: 'mollerOS user',
    email: 'anon@5079.ml'
  }
)
author.subscribe((author) =>
  localStorage.setItem('gitauthor', JSON.stringify(author))
)
export const tip: Writable<boolean> = writable(
  localStorage.getItem('tip') !== 'false'
)
tip.subscribe((tip) => localStorage.setItem('tip', tip.toString()))
