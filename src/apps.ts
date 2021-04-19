import Settings from './apps/Settings.svelte'
import type { App } from './types'
import Terminal from './apps/Terminal.svelte'
import Dog from './apps/dog.svelte'
import Spuchbop from './apps/spuchbop.svelte'
import DaBaby from './apps/DaBaby.svelte'
import Hydra from './apps/Hydra.svelte'
import SessionManager from './apps/SessionManager.svelte'
import FileExplorer from './apps/FileExplorer/FileExplorer.svelte'
import Trollface from './apps/Trollface.svelte'
const apps: App[] = [
  {
    name: 'Settings',
    component: Settings,
    icon: 'icon.svg'
  },
  {
    name: 'Terminal',
    component: Terminal,
    icon:
      'https://upload.wikimedia.org/wikipedia/commons/0/01/Windows_Terminal_Logo_256x256.png'
  },
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
    name: 'DaBaby',
    component: DaBaby,
    icon: 'https://upload.wikimedia.org/wikipedia/en/9/98/Dababy_BabyOnBaby.jpg'
  },
  {
    name: 'Hydra',
    component: Hydra,
    icon: 'https://windows93.net/c/sys/skins/w93/apps/hydra.png'
  },
  {
    name: 'File Explorer',
    icon:
      'https://winaero.com/blog/wp-content/uploads/2019/09/File-Explorer-fluent-icon.png',
    component: FileExplorer
  },
  {
    name: 'trollface',
    icon: 'https://pngimg.com/uploads/trollface/trollface_PNG15.png',
    component: Trollface
  }
].sort((a, b) => a.name.localeCompare(b.name))
export default apps
