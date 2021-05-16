<script lang="ts">
  import type { Session } from '../types'
  import { minimized } from '../stores'
  import { close } from '../util'

  export let session: Session
  export let maximized: boolean = false
  function minimize() {
    $minimized = $minimized.add(session.id)
  }
</script>

<header on:mousedown|self>
  <div>
    <img
      on:dblclick={() => close(session.id)}
      src={session.app.icon}
      height="20"
      alt={session.app.name}
    />{session.app.name}
  </div>
  <nav>
    <button class="min" on:click={minimize}>🗕︎</button>
    <button class="min" on:click={() => (maximized = !maximized)}
      >{maximized ? '🗗︎' : '🗖'}</button
    >
    <button class="close" on:click={() => close(session.id)}>🗙︎</button>
  </nav>
</header>


<style>
  nav {
    float: right;
  }
  nav button {
    background: transparent;
    color: white;
    display: inline-block;
    border-radius: 0;
    border: 0;
  }
  nav button:focus,
  nav button:hover {
    background: #e81123;
  }
  header div {
    pointer-events: none;
    height: 35px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }
  header div img {
    pointer-events: all;
    margin-right: 0.5em;
  }
  header {
    position: sticky;
    top: 0;
    user-select: none;
    z-index: 10;
    width: 100%;
    height: 35px;
    color: white;
    background: darkslategray;
  }
  @media (prefers-color-scheme: light) {
    nav button {
      color: black;
    }
    nav button:focus,
    nav button:hover {
      color: white;
    }
    header {
      color: black;
      background: rgb(139, 216, 216);
    }
  }
  @media (max-width: 375px) {
    header {
      pointer-events: none;
      background: none;
      position: absolute;
      top: 0;
    }
  }
</style>
