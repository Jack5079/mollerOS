<script lang="ts">
  import fs from '../../fs'
  import path from '@jkearl/lightning-fs/src/path'
  import apps from '../../apps'

  import { fly } from 'svelte/transition'
  import { sessions } from '../../stores'
  import { nanoid } from '../../util'

  export let directory: string = '/'
  export let contextfile: string = ''

  function revert_to(index: number) {
    directory = directory
      .split('/')
      .filter((_, i) => i <= index)
      .join('/')
  }

  let uploads: FileList
  let overwrite: string
  let input: HTMLInputElement
  $: {
    for (const file of uploads || []) {
      file
        .arrayBuffer()
        .then((buffer) =>
          fs.promises.writeFile(
            path.resolve(directory, file.name),
            new Uint8Array(buffer)
          )
        )
    }
    input && (input.value = '')
  }

  function terminal() {
    $sessions = [
      ...$sessions,
      {
        app: apps.find((app) => app.name === 'Terminal'),
        id: nanoid(),

        props: {
          startingdirectory: path.resolve(directory)
        }
      }
    ]
  }
</script>

<nav on:click={() => (contextfile = '')}>
  <slot />
  <button
    title="Open terminal here"
    aria-label="Open terminal here"
    on:click={terminal}
  >
    >_
  </button>
  <label class="upload" title="Upload" aria-label="Upload" tabindex="0">
    ⬆
    <input
      bind:value={overwrite}
      bind:files={uploads}
      bind:this={input}
      type="file"
      hidden
      multiple
    />
  </label>
  <button on:click={() => (directory = '/')}>/</button>
  {#each directory?.split('/') ?? [] as folder, index}
    {#if folder}
      <button
        class="dir"
        transition:fly={{ y: -10 }}
        on:click={() => revert_to(index)}>{folder}</button
      >
    {/if}
  {/each}
</nav>

<style lang="postcss">
  .upload {
    text-decoration: overline;
  }

  button,
  label {
    background: none;
    padding: 0;
    color: white;
    border: 0;
    margin: 0;
  }

  button,
  label {
    &:hover,
    &:focus {
      background: rgba(255, 255, 255, 0.3);
    }
  }

  nav {
    overflow-x: auto;
    display: flex;
    position: sticky;
    top: 35px;
    background: rgba(0, 0, 0, 0.5);
    align-items: center;
  }

  @media (prefers-color-scheme: light) {
    button,
    label {
      &:hover,
      &:focus {
        background: rgba(0, 0, 0, 0.3);
      }
    }
    button,
    label {
      color: black;
    }
    nav {
      background: rgba(255, 255, 255, 0.5);
    }
  }
  button.dir:not(:first-of-type)::after {
    content: '/';
  }
</style>
