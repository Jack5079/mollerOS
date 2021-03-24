<script lang="ts">
  export let shown: boolean = false;
  import { blur, fade, fly } from "svelte/transition";
  import { flip } from "svelte/animate";
  import apps from "./apps";
  import { open_apps, nanoid } from "./stores";
  import type { App } from "./types";
  let search: HTMLInputElement;
  let query: string = "";
  $: {
    if (shown && search) {
      search.focus();
    }
  }
  $: results = apps
    .filter((app) => app.name.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => +(a.name > b.name));
  function open(app: App) {
    shown = false;
    $open_apps = [
      ...$open_apps,
      {
        app: app,
        id: nanoid(),
      },
    ];
  }
</script>

{#if shown}
  <section
    out:blur
    in:fade={{ duration: 100 }}
    on:keydown={(e) => {
      if (e.key === "Escape") shown = false;
    }}
  >
    <form on:submit|preventDefault={() => open(results[0])}>
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
          in:fly={{ y: -100 }}
          animate:flip={{ duration: 500 }}
        >
          <img alt={result.name} src={result.icon} width="50" />
          {result.name}
        </article>
      {/each}
    </div>
  </section>
{/if}

<style>
  div {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }
  article img {
    margin-right: 1em;
  }
  article {
    cursor: pointer;
    padding: 1em;
    text-align: center;
    margin: 1em;
    background: rgba(0, 0, 0, 0.5);
    display: inline-flex;
    height: 200px;
    justify-content: center;
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
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
  }
</style>
