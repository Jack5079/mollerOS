<script lang="ts">
  export let shown: boolean = false
  import apps from '../apps'
  import Fuse from 'fuse.js'

  import { slide } from 'svelte/transition'
  import { open_apps } from '../stores'
  import { nanoid } from '../util'
  import type { App } from '../types'

  let search: HTMLInputElement
  let query: string = ''

  $: {
    if (shown && search) {
      search.focus()
    }
  }

  $: results = query.trim()
    ? new Fuse(apps, {
        keys: ['name']
      })
        .search(query)
        .map((item) => item.item)
    : apps
  function open(app: App) {
    shown = false
    $open_apps = [
      ...$open_apps,
      {
        app: app,
        id: nanoid()
      }
    ]
  }
  function close(e: Event) {
    if (search && !search.parentElement.contains(e.target as Node)) shown = false
  }
</script>
<svelte:body on:mousedown={close} on:touchend={close} on:keyup={close} />
<section
  transition:slide
  on:keydown={(e) => {
    if (e.key === 'Escape') shown = false
  }}
>
  <form on:submit|preventDefault={() => results[0] && open(results[0])}>
    <input
      type="search"
      placeholder="Search for an app.."
      bind:this={search}
      bind:value={query}
    />
  </form>
  <div>
    {#each results as result (result.name)}
      <article on:click={() => open(result)}>
        <img alt={result.name} src={result.icon} width="50" />
        {result.name}
      </article>
    {/each}
  </div>
</section>

<style>
  article img {
    margin-right: 1em;
  }
  article {
    width: 100%;
    cursor: pointer;
    padding: 0;
    text-align: center;
    display: inline-flex;
    height: 100px;
    align-items: center;
  }
  section {
    overflow: auto;
    color: white;
    text-align: center;
    padding: 0;
    margin: 0;
    position: fixed;
    z-index: 999;
    background: rgba(0, 0, 0, 0.5);
    background: #24292e;
    left: 50%;
    top: 50px;
    max-height: 70vh;
    height: max-content;
    transform: translateX(-50%);
    width: calc(min(600px, 100vw));
  }
  input {
    outline: none;
    background: #2f363d;
    color: white;
    border: none;
    width: 100%;
  }
  input:focus {
    border: solid 2px #104f96;
  }
  img {
    width: 20px;
    margin-right: 0.1em;
  }
  article {
    height: max-content;
  }
  article:hover {
    background: #282e34;
  }
</style>
