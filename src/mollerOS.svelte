<script lang="ts">
  let search: HTMLButtonElement;
  import App from "./Window.svelte";
  import Search from "./Search.svelte";
  import Taskbar from "./Taskbar.svelte";
  
  import { open_apps } from "./stores";
  import { onMount } from "svelte";
  import { install } from "@github/hotkey";

  let show_search = false;
  onMount(() => {
    install(search);
  });
</script>

<body>
  {#each $open_apps as session (session.id)}
    <App {session}>
      <svelte:component this={session.app.component} session={session.id} />
    </App>
  {/each}
  <Search bind:shown={show_search} />
  <Taskbar>
    <button
      bind:this={search}
      aria-label="Search"
      data-hotkey="` `"
      title="Search (Alt+A)"
      on:click={() => {
        show_search = !show_search;
      }}
    >
      🔎
    </button>
  </Taskbar>
</body>

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
    transition: border-bottom 300ms;
  }
  
  button:hover, button:focus {
    background: #3E3E3E;
  }
</style>
