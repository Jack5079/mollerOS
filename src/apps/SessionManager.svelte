<script lang="ts">
  import { open_apps } from '../stores'
  import { close } from '../util'
  import { slide, fly } from 'svelte/transition'
  import { flip } from 'svelte/animate'
  import apps from '../apps'
  let selected_sessions: string[] = []
  // amount of apps that are open + amount of sessions that are open = size of select
  $: size =
    $open_apps.length + new Set($open_apps.map((session) => session.app)).size
</script>

<main>
  <select multiple bind:value={selected_sessions} {size}>
    {#each [...new Set($open_apps.map((session) => session.app))] as app}
      <optgroup
        on:click|self={() => {
          selected_sessions = [
            ...new Set([
              ...selected_sessions,
              ...$open_apps
                .filter((session) => session.app === app)
                .map((session) => session.id)
            ])
          ]
        }}
        transition:fly={{ x: -10, duration: 300 }}
        label={app.name}
        style="background-image: url({JSON.stringify(
          app.icon
        )}); background-repeat: no-repeat; background-position: top right; background-size: 25px 25px;"
      >
        {#each $open_apps.filter((session) => session.app === app) as session (session.id)}
          <option
            animate:flip={{ duration: 300 }}
            transition:fly={{ x: -10, duration: 300 }}
            value={session.id}>Session {session.id}</option
          >
        {/each}
      </optgroup>
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
