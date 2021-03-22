<script lang="ts">
  import { open_apps, minimized } from "./stores";
  import App from "./Window.svelte";
  let trollface
</script>

<main>
  {#each $open_apps as session (session.id)}
    <App {session}>
      <svelte:component this={session.app.component} />
    </App>
  {/each}
  <nav class="taskbar">
    {#each $open_apps as session}
      <button
        class:open={true}
        on:click={() => {
          $minimized.delete(session.id);
          $minimized = $minimized;
          
        }}
      >
        <img src={session.app.icon} alt="Svelte" height="30" />
      </button>
    {/each}
  </nav>
</main>

<style>
  button {
    height: 100%;
    background: none;
    border: none;
    height: 100%;
    padding: 0;
    padding-left: 0.5em;
    padding-right: 0.5em;
    margin: 0;
  }
  .open {
    border-bottom: 2px solid #ff8181;
  }
  .taskbar {
    display: flex;
    justify-content: left;
    align-items: center;
    background: rgba(50, 50, 60, 0.7);
    backdrop-filter: blur(10px);
    border-radius: 20px 20px 0 0;
    width: 100%;
    left: 0;
    bottom: 0;
    height: 40px;
    position: fixed;
  }
</style>
