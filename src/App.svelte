<script lang="ts">
  import { fly } from "svelte/transition";
  import { open_apps, minimized } from "./stores";
  import App from "./Window.svelte";
  import { install } from "@github/hotkey";
  import { onMount } from "svelte";
  let search: HTMLButtonElement;
  import Search from "./Search.svelte";
  onMount(() => {
    install(search);
  });
  let show_search = false;
</script>

<main>
  <Search bind:shown={show_search} />
  {#each $open_apps as session (session.id)}
    <App {session}>
      <svelte:component this={session.app.component} session={session.id} />
    </App>
  {/each}
  <nav class="taskbar">
    <button
      data-hotkey="` `"
      aria-label="Search"
      title="Search (`+`)"
      bind:this={search}
      on:click={() => {
        show_search = !show_search;
      }}
    >
      🔎
    </button>
    {#each $open_apps as session}
      <button
        in:fly={{ duration: 300, x: 50 }}
        out:fly={{ duration: 300, y: -10 }}
        class:open={true}
        title={session.app.name}
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
    overflow-x: auto;
    scrollbar-width: thin;
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
  @media (prefers-color-scheme: light) {
    .taskbar {
      background: rgba(150, 150, 230, 0.7);
    }
    .open {
      border-bottom: 2px solid #917171;
    }
  }
</style>
