<script lang="ts">
  let search: HTMLButtonElement;
  import App from "./Window.svelte";
  import Search from "./Search.svelte";
  import Taskbar from "./Taskbar.svelte";

  import { open_apps } from "./stores";
  import { onMount } from "svelte";
  import { install } from "@github/hotkey";
  import { fly } from "svelte/transition";

  let show_search = false;
  const facts: string[] = [
    "you can press backtick twice to toggle search",
    "the DaBaby app will destroy your filesystem",
    "you can stop the hydra virus by opening session manager and closing all sessions (click the first session and then shift click the last session)",
    "5de probably won't return soon",
    "the terminal has git support (isogit cli)",
  ];
  onMount(() => {
    install(search);
  });
</script>

<body>
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
      <img src="https://5079.ml/5079mlicon.svg" alt="mollerOS" height="30" />
    </button>
  </Taskbar>
  {#each $open_apps as session (session.id)}
    <App {session}>
      <svelte:component this={session.app.component} session={session.id} />
    </App>
  {:else}
    <header transition:fly={{y: -50, opacity: 1}}>
      mollerOS fact: {facts[Math.floor(Math.random() * facts.length)]}
    </header>
  {/each}
</body>

<style>
  header {
    width: 100%;
    height: 50px;
    user-select: none;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
  }
  @media (max-width: 375px) {
    header {
      display: none;
    }
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
