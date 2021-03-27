<script lang="ts">
  import { fly } from "svelte/transition";
  import { open_apps, minimized } from "./stores";
  import { flip } from "svelte/animate";
</script>

<nav class="taskbar">
  <slot />
  {#each $open_apps as session (session.id)}
    <button
      in:fly={{ duration: 300, y: 10 }}
      animate:flip={{ duration: 300 }}
      out:fly={{ duration: 300, y: -10 }}
      class:open={!$minimized.has(session.id)}
      title={session.app.name}
      on:click={() => {
        $minimized.delete(session.id);
        $minimized = $minimized;
        $open_apps = [
          ...$open_apps.filter((sess) => session !== sess),
          session,
        ];
      }}
    >
      <img src={session.app.icon} alt={session.app.name} height="30" />
    </button>
  {/each}
</nav>

<style>
  .open {
    border-bottom: 2px solid #86e8ff;
  }
  .taskbar {
    z-index: 1000;
    overflow-x: auto;
    display: flex;
    justify-content: left;
    align-items: center;
    overflow-y: hidden;
    background: rgba(50, 50, 60, 0.7);
    backdrop-filter: blur(10px);
    width: 100%;
    left: 0;
    bottom: 0;
    height: 40px;
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
      position: static;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .taskbar > *:not(:first-child) {
      display: none;
    }
  }
</style>
