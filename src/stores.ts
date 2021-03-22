import { Writable, writable } from 'svelte/store'
import apps from './apps'
import type { Session } from './types'

export const open_apps: Writable<Session[]> = writable([{
  id: '18e9967c-a9e0-49a5-8a67-2bde7a619ed0',
  app: apps[0]
}, /*{
  id: 'b0b48878-bfa0-4d25-8a86-85fb91435ea6',
  app: apps[1]
}, */{
  id: 'daterminal',
  app: apps[2]
}])
export const minimized: Writable<Set<string>> = writable(new Set)
