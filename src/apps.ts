import Settings from './apps/Settings.svelte'
import Terminal from './apps/Terminal.svelte'
import Dog from './apps/dog.svelte'
import Spuchbop from './apps/spuchbop.svelte'
import DaBaby from './apps/DaBaby.svelte'
import Hydra from './apps/Hydra.svelte'
import SessionManager from './apps/SessionManager.svelte'
import FileExplorer from './apps/FileExplorer/FileExplorer.svelte'
import Trollface from './apps/Trollface.svelte'
import Reset from './apps/Reset.svelte'

import type { App } from './types'
import type { SvelteComponentDev } from 'svelte/internal'

const emoji = (char: string) => `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${char}</text></svg>`

const app = (component: SvelteComponentDev, icon: string = 'icon.svg'): App => ({
  name: component.name,
  component,
  icon: icon.length < 6 ? emoji(icon) : icon // Shortest possible link is "//a.ml" so anything shorter is an emoji
})

const apps: App[] = [
  app(Terminal, 'https://upload.wikimedia.org/wikipedia/commons/0/01/Windows_Terminal_Logo_256x256.png'),
  app(DaBaby, 'https://upload.wikimedia.org/wikipedia/en/9/98/Dababy_BabyOnBaby.jpg'),
  app(Hydra, 'https://windows93.net/c/sys/skins/w93/apps/hydra.png'),
  app(Settings),
  {
    name: 'dog',
    component: Dog,
    icon: 'https://5079.ml/bark-beagle/assets/beg.webp'
  },
  {
    name: 'spuchbop',
    component: Spuchbop,
    icon:
      'https://cdn.discordapp.com/attachments/763177139850969090/823616397283295264/tenor.gif'
  },
  {
    name: 'Session Manager',
    component: SessionManager,
    icon:
      'https://winaero.com/blog/wp-content/uploads/2019/03/task-manager-taskmgr-icon-big.png'
  },
  {
    name: 'File Explorer',
    icon: emoji('📂'),
    component: FileExplorer
  },
  {
    name: 'trollface',
    icon: 'https://pngimg.com/uploads/trollface/trollface_PNG15.png',
    component: Trollface
  }, {
    name: 'Factory Reset',
    icon: emoji('💾'),
    component: Reset
  }
].sort((a, b) => a.name.localeCompare(b.name))
export default apps
