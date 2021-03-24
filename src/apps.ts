import Hello from './apps/Notepad.svelte'
import fivede from './apps/5de.svelte'
import type { App } from './types'
import Terminal from './apps/Terminal.svelte'
import Dog from './apps/dog.svelte'
import Spuchbop from './apps/spuchbop.svelte'
import DaBaby from './apps/DaBaby.svelte'
import Hydra from './apps/Hydra.svelte'
import TaskManager from './apps/TaskManager.svelte'
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
  name: 'dog',
  component: Dog,
  icon: 'https://5079.ml/bark-beagle/assets/beg.webp'
}, {
  name: 'spuchbop',
  component: Spuchbop,
  icon: 'https://cdn.discordapp.com/attachments/763177139850969090/823616397283295264/tenor.gif'
}, {
  name: 'Task Manager',
  component: TaskManager,
  icon: 'https://winaero.com/blog/wp-content/uploads/2019/03/task-manager-taskmgr-icon-big.png'
}, {
  name: 'DaBaby',
  component: DaBaby,
  icon: 'https://upload.wikimedia.org/wikipedia/en/9/98/Dababy_BabyOnBaby.jpg'
}, {
  name: 'Hydra',
  component: Hydra,
  icon: 'https://windows93.net/c/sys/skins/w93/apps/hydra.png'
}]
export default apps
