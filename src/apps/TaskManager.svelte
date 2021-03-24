<script lang="ts">
  import { open_apps } from "../stores";
  import { fade, fly } from "svelte/transition";
  let closes: import("../types").Session[] = [];
  function close() {
    $open_apps = $open_apps.filter(
      (session) =>
        !closes.map((closedsession) => closedsession.id).includes(session.id)
    );
    closes = [];
  }
</script>

<main>
  <select multiple bind:value={closes} size={$open_apps.length}>
    {#each $open_apps as session (session.id)}
      <option transition:fly={{ x: -10 }} value={session}
        >{session.app.name}</option
      >
    {/each}
  </select>
  {#if closes.length}
    <button on:click={close} transition:fade
      >End {closes.length === 1 ? "task" : "tasks"}</button
    >
  {/if}
</main>

<style>
  select {
    scrollbar-width: none;
    background: transparent;
    border: 0;
    background: transparent;
  }
  main {
    min-height: calc(100% - 35px);
    background: black;
  }
  select,
  main {
    color: white;
    width: 100%;
  }
  button {
    width: 100%;
  }
  @media (prefers-color-scheme: light) {
    main {
      background: white;
      color: black;
    }
    select {
      color: black;
    }
  }
</style>
