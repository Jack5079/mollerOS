import { Writable, writable } from 'svelte/store'
import type { Session } from './types'
import type { commit } from 'isomorphic-git'
function save(init: string, saveto: string): Writable<string> {
  const write = writable(localStorage.getItem(saveto) ?? init)
  write.subscribe((value) => localStorage.setItem(saveto, value.toString()))
  return write
}
export const open_apps: Writable<Session[]> = writable([])
export const minimized: Writable<Set<string>> = writable(new Set())
export const wallpaper: Writable<string> = save('v3', 'wallpaper')
export const author: Writable<
  Parameters<typeof commit>[0]['author']
> = writable(
  JSON.parse(localStorage.getItem('gitauthor')) || {
    name: 'mollerOS user',
    email: 'anon@5079.ml'
  }
)
author.subscribe((author) =>
  localStorage.setItem('gitauthor', JSON.stringify(author))
)
export const tip = save('true', 'tip')
