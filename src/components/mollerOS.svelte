<script lang="ts">
  import App from './Window.svelte'
  import Search from './Search.svelte'
  import Taskbar from './Taskbar.svelte'
  import Loading from './Loading.svelte'

  import { sessions, wallpaper } from '../stores'

  let show_search = false
  $: {
    $sessions.forEach((session) => {
      if (typeof session.app.component == 'function') {
        session.app.component = session.app.component()
      }
    })
  }
</script>

<!--
@component
The mollerOS desktop.
-->
<body class={'molla ' + $wallpaper}>
  {#if show_search}
    <Search bind:shown={show_search} />
  {/if}
  <Taskbar />
  {#each $sessions as session (session.id)}
    <App {session}>
      {#await session.app.component}
        <article>
          <Loading />
        </article>
      {:then component}
        <svelte:component
          this={component.default}
          session={session.id}
          {...session.props}
        />
      {/await}
    </App>
  {/each}
</body>

<style>
  article {
    width: 100%;
    background: black;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    text-align: center;
  }
  @media (prefers-color-scheme: light) {
    article {
      background: white;
      color: black;
    }
  }
  body {
    background-size: cover;
  }
  .bliss {
    background-image: url(../wallpapers/bliss.jpg);
  }
  .mollersuite {
    background-image: url(../wallpapers/mollersuite.png);
  }
  .upleft {
    background-image: url(https://5079.ml/branding/jack5079/pfp.jpg);
  }
  .v3 {
    background-image: url(../wallpapers/v3.png);
    background-position: center;
  }
  .vortex {
    background-image: url(../wallpapers/vortex.png);
    background-position: center;
  }
</style>
