<script lang="ts">
  import { fly } from 'svelte/transition'
  import { open_apps, minimized } from '../stores'
  import { flip } from 'svelte/animate'
</script>

<nav class="taskbar">
  <slot name="start" />
  {#each $open_apps as session (session.id)}
    <button
      in:fly={{ duration: 300, y: 10 }}
      animate:flip={{ duration: 300 }}
      out:fly={{ duration: 300, y: -10 }}
      class:open={!$minimized.has(session.id)}
      title={session.app.name}
      on:click={() => {
        $minimized.delete(session.id)
        $minimized = $minimized
        $open_apps = [...$open_apps.filter((sess) => session !== sess), session]
      }}
    >
      <img src={session.app.icon} alt={session.app.name} height="30" />
    </button>
  {/each}
  <slot name="tray" />
</nav>

<style>
  .open {
    border-bottom: 2px solid #86e8ff;
  }
  .taskbar {
    z-index: 1000;
    background: rgba(50, 50, 60, 0.7);
    backdrop-filter: blur(10px);
    width: 100%;
    left: 0;
    max-height: 75vh;
    bottom: 0;
    position: fixed;
  }

  @media (prefers-color-scheme: light) {
    .taskbar {
      background: rgba(150, 150, 230, 0.7);
    }
  }

  button {
    height: 100%;
    background: none;
    border: none;
    padding: 0 0.5em;
    margin: 0;
    transition: border-bottom 300ms;
  }
  button:hover,
  button:focus {
    background: #3e3e3e;
  }
  @media (max-width: 375px) {
    .taskbar {
      display: flex;
      justify-content: center;
      align-items: center;
      position: static;
    }
    .taskbar > :global(*:not(:first-child)) {
      display: none;
    }
  }
</style>
