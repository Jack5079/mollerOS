<script lang="ts">
  export let shown: boolean = false
  import apps from '../apps'

  import { slide } from 'svelte/transition'
  import { sessions } from '../stores'
  import { nanoid } from '../util'
  import type { App } from '../types'

  let search: HTMLInputElement
  let query: string = ''

  $: {
    if (shown && search) {
      search.focus()
    }
  }

  let results = apps

  $: {
    const q = query.trim()
    if (q) {
      import('fuse.js').then((fuse) => {
        results = new fuse.default(apps, {
          keys: ['name']
        })
          .search(q)
          .map((item) => item.item)
      })
    } else results = apps
  }

  let index = 0
  $: query && (index = 0) // changes index to 0 whenever query changes

  function open(app: App) {
    shown = false
    $sessions = [
      ...$sessions,
      {
        app: app,
        id: nanoid(),
        minimized: true
      }
    ]
  }
  function close(e: KeyboardEvent | MouseEvent | TouchEvent) {
    if (
      search &&
      !search.parentElement!.contains(e.target as Node) &&
      !(e.target as HTMLElement).matches(
        'nav > button:first-child, nav > button:first-child > img'
      )
    )
      shown = false
  }
</script>

<svelte:body on:mousedown={close} on:touchend={close} on:keyup={close} />
<!--
@component
mollerOS search, powered by fuse.js
-->
<section
  transition:slide
  on:keydown={(e) => {
    if (e.key === 'Escape') shown = false
  }}
>
  <label for="search">Search</label>
  <form on:submit|preventDefault={() => results[index] && open(results[index])}>
    <input
      id="search"
      name="search"
      type="search"
      placeholder="Search for an app.."
      bind:this={search}
      bind:value={query}
      on:keydown={(e) => {
        if (query.endsWith('`') && e.key === '`') {
          shown = false
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault()
          if (index === 0) {
            index = results.length - 1
          } else {
            index -= 1
          }
        } else if (e.key === 'ArrowDown') {
          e.preventDefault()
          index = (index + 1) % results.length
        }
      }}
    />
  </form>
  <div>
    {#each results as result, i (result.name)}
      <article on:click={() => open(result)} class:index={i === index}>
        <img alt={result.name} src={result.icon} width="50" />
        {result.name}
      </article>
    {:else}
      <article class:index={true}>No matching apps</article>
    {/each}
  </div>
</section>

<style>
  img {
    width: 20px;
    height: 20px;
    object-fit: contain;
    margin-right: 0.1em;
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
    background: rgba(36, 41, 46, 0.9);
    backdrop-filter: blur(10px);
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

  article:not(.index):hover {
    background: rgb(40, 46, 52, 0.5);
  }
  .index {
    background: rgb(4, 66, 137, 0.5);
  }
  @media (prefers-color-scheme: light) {
    section {
      background: rgba(255, 255, 255, 0.9);
      color: black;
    }
    input {
      color: black;
      background: white;
    }
    input:focus {
      border: solid 2px rgb(41, 140, 255);
    }
    article:hover {
      background: rgb(235, 240, 244, 0.9);
    }
    .index {
      color: white;
    }
  }
  article {
    height: max-content;
  }
</style>
