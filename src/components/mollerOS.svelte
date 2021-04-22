<script lang="ts">
  import App from './Window.svelte'
  import Search from './Search.svelte'
  import Taskbar from './Taskbar.svelte'
  import Tip from './Tip.svelte'

  import { open_apps, wallpaper } from '../stores'
  import { install as hotkey } from '@github/hotkey'

  let show_search = false
</script>

<body class={'molla ' + $wallpaper}>
  {#if show_search}
    <Search bind:shown={show_search} />
  {/if}
  <Taskbar>
    <button
      use:hotkey={'` `'}
      aria-label="Search"
      title="Search (Alt+A)"
      on:click={() => (show_search = !show_search)}
    >
      <img src="icon.svg" alt="mollerOS" height="30" />
    </button>
  </Taskbar>
  {#each $open_apps as session (session.id)}
    <App {session}>
      <svelte:component this={session.app.component} session={session.id} {...session.props} />
    </App>
  {:else}
    <Tip />
  {/each}
</body>

<style>
  .bliss {
    background-image: url(../bliss.jpg);
  }
  .mollersuite,
  .upleft {
    background-size: cover;
  }
  .mollersuite {
    background-image: url(../mollersuite.png);
  }
  .upleft {
    background-image: url(https://5079.ml/branding/jack5079/pfp.jpg);
  }
  .v3 {
    background-image: url(../v3.png);
    background-position: center;
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
