import { Writable, writable } from 'svelte/store'
import apps from './apps'
import type { Session } from './types'

export const open_apps: Writable<Session[]> = writable([{
  id: 'daterminal',
  app: apps[2]
}])
export const minimized: Writable<Set<string>> = writable(new Set)
