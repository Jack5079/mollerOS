<script lang="ts">
  import { fly } from 'svelte/transition'
  import { sessions } from '../stores'
  import { install as hotkey } from '@github/hotkey'
  import { flip } from 'svelte/animate'
  import Search from './Search.svelte'
  let height: number
  let hovering: boolean = true
  let search: boolean = false
  $: hovering = search || hovering
</script>

{#if search}
  <Search bind:shown={search} />
{/if}

<button
  hidden
  on:click={() => {
    search = true
  }}
  use:hotkey={'` `'}
/>
<div
  on:mouseenter={() => (hovering = true)}
  on:mouseleave={() => (hovering = false)}
>
  {#if hovering}
    <nav
      class="taskbar"
      in:fly={{ duration: 300, y: height, opacity: 1 }}
      out:fly={{
        duration: 300,
        delay: ($sessions.length + 1) * 100,
        opacity: 1,
        y: 100
      }}
      bind:offsetHeight={height}
    >
      <button
        aria-label="Search"
        in:fly={{ duration: 300, delay: 100, opacity: 1, y: 100 }}
        out:fly={{ duration: 300, opacity: 1, y: 100 }}
        on:click={() => (search = true)}
        ><span class="material-icons">search</span></button
      >
      {#each $sessions as session, i (session.id)}
        <button
          aria-label={session.app.name}
          animate:flip={{ duration: 300 }}
          in:fly={{ duration: 300, delay: (i + 2) * 100, opacity: 1, y: 100 }}
          out:fly={{ duration: 300, delay: (i + 1) * 100, opacity: 1, y: 100 }}
          class:open={!session.minimized}
          on:click={() => {
            session.minimized = false
            $sessions = [
              ...$sessions.filter((sess) => session !== sess),
              session
            ]
          }}
        >
          {#if session.app.icon.startsWith('https://') || session.app.icon.startsWith('data:')}
            <img
              src={session.app.icon}
              alt={session.app.name}
              height="24"
              width="24"
            />
          {:else}
            <span class="material-icons">
              {session.app.icon}
            </span>
          {/if}
        </button>
      {/each}
    </nav>
  {/if}
</div>

<style>
  div {
    min-width: 50%;
    max-width: 100vw;
    overflow-y: hidden;
    position: absolute;
    bottom: 0;
    height: 100px;
    z-index: 10000;
    left: 50%;
    transform: translate(-50%);
  }

  .taskbar {
    overflow-y: hidden;
    position: relative;
    top: 0;
    min-width: 50%;
    border-top-left-radius: 1em;
    border-top-right-radius: 1em;
    color: white;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1ch;
    flex-direction: row;
    background: darkslategray;
  }

  @media (prefers-color-scheme: light) {
    .taskbar {
      background: white;
    }
  }

  button {
    text-align: center;
    position: relative;
    background: none;
    border: none;
    color: white;
    display: grid;
    place-content: center;
    padding: 1em;
    border-radius: 1em;
    transition: background 0.3s;
  }

  button:hover,
  .open {
    background: rgba(255, 255, 255, 0.3);
  }

  button:hover::after {
    font-family: 'Segoe UI';
    font-weight: bold;
    content: attr(aria-label);
    animation: zoom 0.3s forwards;
    font-size: small;
  }
  
  button:active {
    background: rgba(255, 255, 255, 0.7);
  }

  @keyframes zoom {
    from {
      font-size: 0;
    }

    to {
      font-size: small;
    }
  }
</style>
