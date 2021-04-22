<script lang="ts">
  import App from './Window.svelte'
  import Search from './Search.svelte'
  import Taskbar from './Taskbar.svelte'
  import Tip from './Tip.svelte'

  import { open_apps, wallpaper, tip } from '../stores'
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
      <svelte:component
        this={session.app.component}
        session={session.id}
        {...session.props}
      />
    </App>
  {:else}
    {#if $tip}
      <Tip />
    {/if}
  {/each}
  {#if location.hostname === 'localhost'}
    <div>v{'PKG_VERSION'}</div>
  {/if}
</body>

<style>
  body {
    background-size: cover;
  }
  .bliss {
    background-image: url(../bliss.jpg);
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
    /* height: 100%; */
    padding: 0 0.5em;
    margin: 0;
  }

  button:hover,
  button:focus {
    background: #3e3e3e;
  }
  div {
    float: right;
    text-align: right;
    color: white;
    font-family: monospace;
  }
  @media (prefers-color-scheme: light) {
    div {
      color: black;
    }
  }
</style>
