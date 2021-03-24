import Hello from './apps/Notepad.svelte'
import fivede from './apps/5de.svelte'
import type { App } from './types'
import Terminal from './apps/Terminal.svelte'
import Hoppscotch from './apps/Hoppscotch.svelte'
import Dog from './apps/dog.svelte'
import Spuchbop from './apps/spuchbop.svelte'
import DaBaby from './apps/DaBaby.svelte'
const apps: App[] = [{
  name: 'Notepad',
  component: Hello,
  icon: 'https://winaero.com/blog/wp-content/uploads/2020/02/Windows-10X-Colorful-Notepad-Fluent-Icon.png'
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
}, {
  name: 'spuchbop',
  component: Spuchbop,
  icon: 'https://cdn.discordapp.com/attachments/763177139850969090/823616397283295264/tenor.gif'
}, {
  name: 'DaBaby',
  component: DaBaby,
  icon: 'https://upload.wikimedia.org/wikipedia/en/9/98/Dababy_BabyOnBaby.jpg'
}]
export default apps
