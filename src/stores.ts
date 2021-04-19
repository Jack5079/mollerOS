import { Writable, writable } from 'svelte/store'
import type { Session } from './types'
import type {commit} from 'isomorphic-git'
export const open_apps: Writable<Session[]> = writable([])
export const minimized: Writable<Set<string>> = writable(new Set())
export const wallpaper: Writable<string> = writable(localStorage.getItem('wallpaper') || 'bliss')
export const author: Writable<Parameters<typeof commit>[0]['author']> = writable(JSON.parse(localStorage.getItem('gitauthor')) || {
  name: 'mollerOS user',
  email: 'anon@5079.ml'
})
