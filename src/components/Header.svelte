<script lang="ts">
  import type { Session } from '../types'
  import { close } from '../util'

  export let session: Session
  export let maximized: boolean = false
</script>

<header tabindex="0">
  <div>
    {#if session.app.icon.startsWith('https://') || session.app.icon.startsWith('data:')}
      <img
        on:dblclick={() => close(session.id)}
        src={session.app.icon}
        alt={session.app.name}
        height="20"
      />
    {:else}
      <span class="material-icons">
        {session.app.icon}
      </span>
    {/if}{session.app.name}
  </div>
  <nav>
    <button class="min material-icons" on:click={() => (maximized = !maximized)}
      >{maximized ? 'fullscreen_exit' : 'fullscreen'}</button
    >
    <button class="close material-icons" on:click={() => close(session.id)}
      >close</button
    >
  </nav>
</header>

<style lang="postcss">
  nav {
    float: right;
  }
  header:focus-visible {
    background: lightslategray;
  }
  nav button {
    background: transparent;
    color: white;
    display: inline-block;
    border-radius: 0;
    border: 0;
    height: 35px;
    &:focus,
    &:hover {
      background: #e81123;
    }
  }
  header {
    & div {
      pointer-events: none;
      height: 35px;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      & img,
      & span {
        pointer-events: all;
        margin-right: 5px;
      }
    }
    position: sticky;
    top: 0;
    left: 0;
    user-select: none;
    z-index: 10;
    width: 100%;
    height: 35px;
    font-family: moller, 'Segoe UI', sans-serif;
    color: white;
    background: darkslategray;
  }
  @media (prefers-color-scheme: light) {
    nav button {
      color: black;
      &:focus,
      &:hover {
        color: white;
      }
    }
    header {
      color: black;
      background: rgb(139, 216, 216);
      &:focus-visible {
        background: rgb(172, 230, 230);
      }
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
