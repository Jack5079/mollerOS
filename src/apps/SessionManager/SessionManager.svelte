<script lang="ts">
  import { sessions } from '../../stores'
  import { close } from '../../util'
  import { slide, fly } from 'svelte/transition'
  import { flip } from 'svelte/animate'
  import Group from './Group.svelte'
  let selected_sessions: string[] = []
  // amount of apps that are open + amount of sessions that are open = size of select
  $: apps = new Set($sessions.map((session) => session.app))

  $: size =
    $sessions.length + new Set($sessions.map((session) => session.app)).size
</script>

<main>
  <select multiple bind:value={selected_sessions} {size}>
    {#each [...apps].sort((a, b) => a.name.localeCompare(b.name)) as app}
      <Group bind:sessions={selected_sessions} bind:app />
    {/each}
  </select>
  {#if selected_sessions.length}
    <button on:click={() => close(...selected_sessions)} transition:slide
      >End {selected_sessions.length === 1 ? 'session' : 'sessions'}</button
    >
  {/if}
</main>

<style>
  select {
    scrollbar-width: none !important;
    overflow: visible;
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
    min-width: 100%;
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
