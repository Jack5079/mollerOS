<script lang="ts">
  export let contextfile: string = ''
  export let files: Promise<string[]> = Promise.resolve([])
  import fs from '../../fs'
  export let context: HTMLMenuElement

  async function download () {
    const blob = new Blob([await fs.promises.readFile(contextfile)])
    const link = document.createElement('a')
    const href = URL.createObjectURL(blob)
    link.download = contextfile.split('/').pop()
    link.href = href
    link.click()
    URL.revokeObjectURL(href)
    contextfile = ''
  }
  function close (e: Event) {
    if (!context.contains(e.target as Node)) contextfile = ''
  }
</script>
<svelte:body on:mousedown={close} on:touchend={close} on:keyup={close} />
<menu
  class:hidden={!contextfile}
  bind:this={context}
  on:blur={() => (contextfile = '')}
  on:contextmenu|preventDefault
>
  <button
    on:click={async () => {
      await fs.promises.unlink(contextfile)
      files = Promise.resolve(
        (await files).filter((file) => file !== contextfile.split('/').pop())
      )
      contextfile = ''
    }}>Delete</button
  >
  <button
    on:click={download}>Download</button
  >
</menu>

<style>
  .hidden {
    display: none;
  }

  menu {
    position: fixed;
    width: 200px;
    padding: 0;
    color: white;
    background: rgb(50, 50, 50);
  }

  button:hover {
    background: rgba(255,255,255,0.1);
  }
  button {
    background: none;
    color: white;
    border: 0;
    margin: 0;
    width: 100%;
  }
  @media (prefers-color-scheme: light) {
    button:hover {
    background: rgba(0,0,0,0.1);
  }
    button {
      color: black;
    }
    menu {
      background: rgb(200, 200, 200);
      color: black;
    }
  }
</style>
