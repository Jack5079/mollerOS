<script lang="ts">
  import App from './Window.svelte'
  import Search from './Search.svelte'
  import Taskbar from './Taskbar.svelte'
  import Tip from './Tip.svelte'

  import { open_apps } from '../stores'
  import { install as hotkey } from '@github/hotkey'
  import { onMount } from 'svelte'

  let show_search = false
  let time = new Date().toLocaleString()

  onMount(() => {
    const id = setInterval(() => {
      time = new Date().toLocaleString()
    }, 1000)
    return () => clearInterval(id)
  })
</script>

<body>
  {#if show_search}
    <Search bind:shown={show_search} />
  {/if}
  <Taskbar>
    <button
      slot="start"
      use:hotkey={'` `'}
      aria-label="Search"
      title="Search (Alt+A)"
      on:click={() => (show_search = !show_search)}
    >
      <img src="https://5079.ml/5079mlicon.svg" alt="mollerOS" height="30" />
    </button>
    <nav slot="tray">
      <span>{time}</span>
    </nav>
  </Taskbar>
  {#each $open_apps as session (session.id)}
    <App {session}>
      <svelte:component this={session.app.component} session={session.id} />
    </App>
  {:else}
    <Tip />
  {/each}
</body>

<style>
  nav {
    padding-right: 1em;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    float: right;
    color: white;
  }
  button {
    background: none;
    border: none;
    height: 100%;
    padding: 0 0.5em;
    margin: 0;
  }

  button:hover,
  button:focus {
    background: #3e3e3e;
  }
</style>
