<script lang="ts">
  import App from './Window.svelte'
  import Search from './Search.svelte'
  import Taskbar from './Taskbar.svelte'
  import Tip from './Tip.svelte'
  import Tray from './Tray.svelte'
  
  import { open_apps } from '../stores'
  import { install as hotkey } from '@github/hotkey'

  let show_search = false
</script>

<body class="molla">
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
    <Tray slot="tray" />
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
