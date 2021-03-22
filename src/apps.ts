import Hello from './apps/Notepad.svelte'
import fivede from './apps/5de.svelte'
import type { App } from './types'
import Terminal from './apps/Terminal.svelte'
import Hoppscotch from './apps/Hoppscotch.svelte'
import Dog from './apps/dog.svelte'

const apps: App[] = [{
  name: 'Notepad',
  component: Hello,
  icon: 'favicon.png'
}, {
  name: '5de',
  component: fivede,
  icon: 'https://5079.ml/5079mlicon.svg'
}, {
  name: 'Terminal',
  component: Terminal,
  icon: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Windows_Terminal_Logo_256x256.png'
}, {
  name: 'Hoppscotch',
  component: Hoppscotch,
  icon: 'https://hoppscotch.io/icon.png'
}, {
  name: 'dog',
  component: Dog,
  icon: 'https://5079.ml/bark-beagle/assets/beg.webp'
}]
export default apps
