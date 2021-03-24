<script lang="ts">
  import { open_apps } from "../stores";
  import { fade } from "svelte/transition";
  let closes: import("../types").Session[] = [];
  function close() {
    $open_apps = $open_apps.filter(
      (session) =>
        !closes.map((closedsession) => closedsession.id).includes(session.id)
    );
  }
</script>

<main>
  <select multiple bind:value={closes} size={$open_apps.length}>
    {#each $open_apps as session (session.id)}
      <option value={session}>{session.app.name}</option>
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
    }
    main {
      height: calc(100% - 35px);
    }
    select,
    main {
      background: black;
      color: white;
      width: 100%;
    }
  </style>
