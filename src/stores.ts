import { Writable, writable } from 'svelte/store'
import type { Session } from './types'

export const open_apps: Writable<Session[]> = writable([])
export const minimized: Writable<Set<string>> = writable(new Set)

export const nanoid = (t = 21) => {
  let e = "",
    r = crypto.getRandomValues(new Uint8Array(t))
  for (; t--;) {
    let n = 63 & r[t]
    e +=
      n < 36
        ? n.toString(36)
        : n < 62
          ? (n - 26).toString(36).toUpperCase()
          : n < 63
            ? "_"
            : "-"
  }
  return e
}
