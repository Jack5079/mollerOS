<script lang="ts">
  import { getIconForFile, getIconForFolder } from 'vscode-icons-js'
  import Loading from '../../components/Loading.svelte'
  export let context: HTMLMenuElement
  export let contextfile: string
  export let directory: string = '/'
  export let file: string = ''
  import fs from '../../fs'
  async function open(file: string) {
    const stat = await fs.promises.stat(directory + '/' + file)
    if (stat.type === 'dir') {
      directory = `${directory}/${file}/`
    }
  }

  function rightclick(node: HTMLElement, file: string) {
    node.addEventListener('contextmenu', async (event) => {
      event.preventDefault()
      const stat = await fs.promises.stat(directory + file + '/')
      if (stat.type === 'file') {
        contextfile = directory + file
        context.hidden = false
        context.style.left = event.clientX + 'px'
        context.style.top = event.clientY + 'px'
      }
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
  {#await fs.promises.stat(directory + '/' + file)}
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
  @media (prefers-color-scheme: light) {
    tr > td {
      color: black;
    }

    tr:hover {
      background: rgba(0, 0, 0, 0.3);
    }
  }
</style>
