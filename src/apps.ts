import type { App } from './types'

const emoji = (char: string) =>
  `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${char}</text></svg>`

const apps: App[] = [
  {
    name: 'Settings',
    component: () => import('./apps/Settings.svelte'),
    icon: 'icon.svg'
  },
  {
    name: 'Terminal',
    component: () => import('./apps/Terminal/Terminal.svelte'),
    icon:
      'https://upload.wikimedia.org/wikipedia/commons/0/01/Windows_Terminal_Logo_256x256.png'
  },
  {
    name: 'dog',
    component: () => import('./apps/dog.svelte'),
    icon: 'https://5079.ml/bark-beagle/assets/beg.webp'
  },
  {
    name: 'spuchbop',
    component: () => import('./apps/spuchbop.svelte'),
    icon:
      'https://cdn.discordapp.com/attachments/763177139850969090/823616397283295264/tenor.gif'
  },
  {
    name: 'Session Manager',
    component: () => import('./apps/SessionManager.svelte'),
    icon:
      'https://winaero.com/blog/wp-content/uploads/2019/03/task-manager-taskmgr-icon-big.png'
  },
  {
    name: 'DaBaby',
    component: () => import('./apps/DaBaby.svelte'),
    icon: 'https://upload.wikimedia.org/wikipedia/en/9/98/Dababy_BabyOnBaby.jpg'
  },
  {
    name: 'Hydra',
    component: () => import('./apps/Hydra.svelte'),
    icon: 'https://windows93.net/c/sys/skins/w93/apps/hydra.png'
  },
  {
    name: 'File Explorer',
    icon: emoji('📂'),
    component: () => import('./apps/FileExplorer/FileExplorer.svelte')
  },
  {
    name: 'trollface',
    icon: 'https://pngimg.com/uploads/trollface/trollface_PNG15.png',
    component: () => import('./apps/Trollface.svelte')
  },
  {
    name: 'Factory Reset',
    icon: emoji('💾'),
    component: () => import('./apps/Reset.svelte')
  },
  {
    name: 'fart',
    icon: emoji('💥'),
    component: () => import('./apps/fart.svelte')
  }
].sort((a, b) => a.name.localeCompare(b.name))
export default apps
