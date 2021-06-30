<script lang="ts">
  export let contextfile: string = ''
  export let files: Promise<string[]> = Promise.resolve([])
  import fs from '../../fs'
  import Wormhole from '../../components/Wormhole.svelte'
  $: isfile = contextfile
    ? fs.promises.stat(contextfile).then((stat) => stat.type === 'file')
    : false
  import { slide } from 'svelte/transition'
  import Path from '@jkearl/lightning-fs/src/path'
  export let context: HTMLMenuElement

  async function download() {
    const blob = new Blob([await fs.promises.readFile(contextfile)])
    const link = document.createElement('a')
    const href = URL.createObjectURL(blob)
    link.download = contextfile.split('/').pop()
    link.href = href
    link.click()
    URL.revokeObjectURL(href)
    contextfile = ''
  }
  async function upload() {
    // I hate DOM so fucking much

    const container = new DataTransfer()
    if (await isfile) {
      const blob = new File(
        [await fs.promises.readFile(contextfile)],
        contextfile.split('/').pop()
      )

      container.items.add(blob)
    } else {
      const folder = await fs.promises.readdir(contextfile)
      for (const file of folder) {
        const absolute = Path.resolve(contextfile, file)
        if ((await fs.promises.stat(absolute)).type === 'file') {
          const blob = new File([await fs.promises.readFile(absolute)], file)

          container.items.add(blob)
        }
      }
    }
    const form = document.createElement('form')
    form.style.display = 'none'
    form.action = 'https://wormhole.app/share-target'
    form.method = 'post'
    form.encoding = 'multipart/form-data'
    const input = document.createElement('input')
    form.append(input)
    input.type = 'file'
    input.multiple = true
    input.name = 'files'
    input.id = 'files'
    document.body.append(form)
    input.files = container.files
    form.submit()
  }
  async function del() {
    await fs.promises.unlink(contextfile)
    files = Promise.resolve(
      (await files).filter((file) => file !== contextfile.split('/').pop())
    )
    contextfile = ''
  }
  function close(e: Event) {
    if (context && !context.contains(e.target as Node)) contextfile = ''
  }
</script>

<svelte:body on:mousedown={close} on:touchend={close} on:keyup={close} />
{#if contextfile}
  <menu
    transition:slide={{ duration: 500 }}
    bind:this={context}
    on:blur={() => (contextfile = '')}
    on:contextmenu|preventDefault
  >
    <button on:click={del}>Delete</button>
    <button on:click={upload}><Wormhole />Upload to Wormhole</button>
    {#await isfile then isfile}
      {#if isfile}
        <button on:click={download}>Download</button>
      {/if}
    {/await}
  </menu>
{/if}

<style lang="postcss">
  menu {
    position: fixed;
    width: 200px;
    padding: 0;
    color: white;
    background: rgb(50, 50, 50);
  }
  button {
    background: none;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1ch;
    flex-direction: row;
    border: 0;
    margin: 0;
    width: 100%;
    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }
  @media (prefers-color-scheme: light) {
    button {
      color: black;
      &:hover {
        background: rgba(0, 0, 0, 0.1);
      }
    }
    menu {
      background: rgb(200, 200, 200);
      color: black;
    }
  }
</style>
