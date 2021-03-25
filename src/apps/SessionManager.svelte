<script lang="ts">
  import { open_apps } from "../stores";
  import { fade, fly } from "svelte/transition";
  import { flip } from "svelte/animate";
  import apps from "../apps";
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
  <select
    multiple
    bind:value={closes}
    size={$open_apps.length +
      apps.filter((app) => $open_apps.some((session) => session.app === app))
        .length}
  >
    {#each apps as app}
      {#if $open_apps.find((session) => session.app === app)}
        <optgroup
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
              value={session}>Session {session.id}</option
            >
          {/each}
        </optgroup>
      {/if}
    {/each}
  </select>
  {#if closes.length}
    <button on:click={close} transition:fade
      >End {closes.length === 1 ? "session" : "sessions"}</button
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
