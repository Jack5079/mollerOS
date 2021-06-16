<script context="module" lang="ts">
  const viewers: {
    [key: string]: App
  } = {
    editor: {
      name: 'Editor',
      component: () => import('./viewers/Editor.svelte'),
      icon:
        'https://winaero.com/blog/wp-content/uploads/2020/02/Windows-10X-Colorful-Notepad-Fluent-Icon.png'
    },
    image: {
      name: 'Image Viewer',
      component: () => import('./viewers/ImageViewer.svelte'),
      icon:
        'https://winaero.com/blog/wp-content/uploads/2019/09/Photos-app-icon-256-colorful.png'
    },
    video: {
      name: 'Video Player',
      component: () => import('./viewers/VideoViewer.svelte'),
      icon:
        'https://winaero.com/blog/wp-content/uploads/2019/09/Movies-and-TV-icon.png'
    },
    audio: {
      name: 'Audio Player',
      component: () => import('./viewers/AudioPlayer.svelte'),
      icon:
        'https://winaero.com/blog/wp-content/uploads/2019/09/Groove-Music-fluent-design-icon.png'
    }
  }

  const openwith = {
    'file_type_video.svg': viewers.video,
    'file_type_image.svg': viewers.image,
    'file_type_audio.svg': viewers.audio
  }
</script>

<script lang="ts">
  import path from '@jkearl/lightning-fs/src/path'
  import fs from '../../fs'
  import { sessions } from '../../stores'
  import { nanoid } from '../../util'
  import { tick } from 'svelte'
  import { getIconForFile, getIconForFolder } from 'vscode-icons-js'
  import type { App } from '../../types'

  export let context: HTMLMenuElement
  export let contextfile: string
  export let directory: string = '/'
  export let file: string = ''

  async function open(file: string) {
    const stat = await fs.promises.stat(path.resolve(directory, file))
    if (stat.type === 'dir') {
      directory = `${directory}/${file}/`
    } else {
      $sessions = [
        ...$sessions,
        {
          id: nanoid(),
          app: openwith[getIconForFile(file)] || viewers.editor,
          minimized: false,
          props: {
            file: path.resolve(directory, file)
          }
        }
      ]
    }
  }

  function rightclick(node: HTMLElement, file: string) {
    async function showcontext(event: MouseEvent) {
      event.preventDefault()
      contextfile = path.resolve(directory, file)
      await tick()
      context.style.left = event.clientX + 'px'
      context.style.top = event.clientY + 'px'
    }
    node.addEventListener('contextmenu', showcontext)
    return {
      destroy() {
        node.removeEventListener('contextmenu', showcontext)
      }
    }
  }
  const fileSize = (num: number, precision = 3, addSpace = true): string => {
    const UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    if (Math.abs(num) < 1) return num + (addSpace ? ' ' : '') + UNITS[0]
    const exponent = Math.min(
      Math.floor(Math.log10(num < 0 ? -num : num) / 3),
      UNITS.length - 1
    )
    const n = Number(
      ((num < 0 ? -num : num) / 1000 ** exponent).toPrecision(precision)
    )
    return (num < 0 ? '-' : '') + n + (addSpace ? ' ' : '') + UNITS[exponent]
  }
</script>

<tr
  on:click={() => open(file)}
  on:keydown={(event)=>{
    if (event.key === 'Enter') {
      open(file)
    }
  }}
  use:rightclick={file}
  tabindex="0"
  role="button"
>
  {#await fs.promises.stat(path.resolve(directory, file)) then stat}
    <td>
      <img
        width="23"
        height="23"
        alt={file}
        src="https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/icons/{stat.type ===
        'dir'
          ? getIconForFolder(file)
          : getIconForFile(file)}"
      />{file}</td
    >
    <td>
      {new Date(stat.mtimeMs).toLocaleString()}
    </td>
    {#if stat.type !== 'dir'}
      <td>
        {fileSize(stat.size)}
      </td>
    {/if}
  {/await}
</tr>

<style>
  tr:hover, tr:focus {
    background: rgba(255, 255, 255, 0.3);
  }

  tr > td {
    background: none;
    color: white;
    border: 0;
  }

  td {
    user-select: none;
  }
  td:first-child {
    display: flex;
  }
  img {
    margin-right: 0.1em;
  }
  @media (prefers-color-scheme: light) {
    tr > td {
      color: black;
    }

    tr:hover, tr:focus {
      background: rgba(0, 0, 0, 0.3);
    }
  }
</style>
