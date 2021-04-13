<script lang="ts">
  import path from '@jkearl/lightning-fs/src/path'
  import Loading from '../../components/Loading.svelte'
  import Editor from './Editor.svelte'
  import fs from '../../fs'

  import { open_apps } from '../../stores'
  import { nanoid } from '../../util'
  import { tick } from 'svelte'
  import { getIconForFile, getIconForFolder } from 'vscode-icons-js'

  export let context: HTMLMenuElement
  export let contextfile: string
  export let directory: string = '/'
  export let file: string = ''

  async function open(file: string) {
    const stat = await fs.promises.stat(path.resolve(directory, file))
    if (stat.type === 'dir') {
      directory = `${directory}/${file}/`
    } else {
      $open_apps = [
        ...$open_apps,
        {
          id: nanoid(),
          app: {
            name: 'Editor',
            component: Editor,
            icon:
              'https://winaero.com/blog/wp-content/uploads/2020/02/Windows-10X-Colorful-Notepad-Fluent-Icon.png'
          },
          props: {
            file: path.resolve(directory, file)
          }
        }
      ]
    }
  }

  function rightclick(node: HTMLElement, file: string) {
    node.addEventListener('contextmenu', async (event) => {
      event.preventDefault()
      contextfile = path.resolve(directory, file)
      await tick()
      context.style.left = event.clientX + 'px'
      context.style.top = event.clientY + 'px'
    })
    return {}
  }
  function fileSize(bytes: number): string {
    var exp = (Math.log(bytes) / Math.log(1024)) | 0
    var result = (bytes / Math.pow(1024, exp)).toFixed(2)

    return result + ' ' + (exp == 0 ? 'bytes' : 'KMGTPEZY'[exp - 1] + 'B')
  }
</script>

<tr on:click={() => open(file)} use:rightclick={file}>
  {#await fs.promises.stat(path.resolve(directory, file))}
    <td><Loading size={23} />{file}</td>
  {:then stat}
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
  tr:hover {
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

    tr:hover {
      background: rgba(0, 0, 0, 0.3);
    }
  }
</style>
