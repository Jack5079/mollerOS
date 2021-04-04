import { Writable, writable } from 'svelte/store'
import type { Session } from './types'

export const open_apps: Writable<Session[]> = writable([])
export const minimized: Writable<Set<string>> = writable(new Set)
