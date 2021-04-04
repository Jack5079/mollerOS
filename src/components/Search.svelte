<script lang="ts">
  export let shown: boolean = false
  import { fly } from 'svelte/transition'
  import { flip } from 'svelte/animate'
  import apps from '../apps'
  import Fuse from 'fuse.js'
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
</script>

{#if shown}
  <section
    transition:fly={{
      duration: 500,
      y: window.innerHeight,
      opacity: 1
    }}
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
        <article
          on:click={() => open(result)}
          in:fly={{ y: -100, duration: 700 }}
          animate:flip={{ duration: 700 }}
        >
          <img alt={result.name} src={result.icon} width="50" />
          {result.name}
        </article>
      {/each}
    </div>
  </section>
{/if}

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
    width: 300px;
    height: calc(max(75vh, 40px));
    bottom: 40px;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
  }
  @media (max-width: 375px) {
    section {
      bottom: 0;
      width: 100%;
      height: calc(100vh - 40px);
    }
  }
</style>
