import type { App } from './types'

const emoji = (char: string) =>
  `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${char}</text></svg>`

/**
 * The list of apps in mollerOS.
 *
 * See {@link App} for the structure.
 */
const apps: App[] = [
  {
    name: 'Files',
    icon: 'folder',
    component: () => import('./apps/FileExplorer/FileExplorer.svelte')
  },
  {
    name: 'Terminal',
    component: () => import('./apps/Terminal/Terminal.svelte'),
    icon: 'code'
  },
  {
    name: 'Settings',
    component: () => import('./apps/Settings.svelte'),
    icon: 'settings'
  },
  {
    name: 'Task Manager',
    component: () => import('./apps/SessionManager/SessionManager.svelte'),
    icon: 'dvr'
  },
  {
    name: 'Molly',
    component: () => import('./apps/dog.svelte'),
    icon: 'pets'
  },
  {
    name: 'spuchbop',
    component: () => import('./apps/spuchbop.svelte'),
    icon:
      'https://cdn.discordapp.com/attachments/763177139850969090/823616397283295264/tenor.gif'
  },
  {
    name: 'DaBaby',
    component: () => import('./apps/DaBaby.svelte'),
    icon: 'https://upload.wikimedia.org/wikipedia/en/9/98/Dababy_BabyOnBaby.jpg'
  },
  {
    name: 'trollface',
    icon: 'https://pngimg.com/uploads/trollface/trollface_PNG15.png',
    component: () => import('./apps/Trollface.svelte')
  },
  {
    name: 'fart',
    icon: emoji('💥'),
    component: () => import('./apps/fart.svelte')
  },
  {
    name: 'Factory Reset',
    icon: 'delete_forever',
    component: () => import('./apps/Reset.svelte')
  }
]
export default apps
