<script lang="ts">
  import { fly } from 'svelte/transition'
  export let directory: string = '/'
  export let contextfile: string = ''

  function revert_to(index: number) {
    directory = directory
      .split('/')
      .filter((_, i) => i <= index)
      .join('/')
  }
</script>

<nav on:click={() => (contextfile = '')}>
  <slot />
  <button on:click={() => (directory = '/')}>/</button>
  {#each (directory?.split('/')) ?? [] as folder, index}
    {#if folder}
      <button
        class="dir"
        transition:fly={{ y: -10 }}
        on:click={() => revert_to(index)}>{folder}</button
      >
    {/if}
  {/each}
</nav>

<style>
  button {
    background: none;
    padding: 0;
    color: white;
    border: 0;
    margin: 0;
  }
  button:hover,
  button:focus {
    background: rgba(255, 255, 255, 0.3);
  }

  @media (prefers-color-scheme: light) {
    button:hover,
    button:focus {
      background: rgba(0, 0, 0, 0.3);
    }
    button {
      color: black;
    }
  }

  nav {
    overflow-x: auto;
    display: flex;
    align-items: center;
  }
  button.dir:not(:first-of-type)::after {
    content: '/';
  }
</style>
