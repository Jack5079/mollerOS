<script lang="ts">
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
  <button on:click={() => (directory = '/')}>/</button>
  {#each directory.split('/') as folder, index}
    {#if folder}
      <button on:click={() => revert_to(index)}>{folder}</button>
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
    button {
      color: black;
    }
  }

  nav {
    overflow-x: auto;
    display: flex;
    align-items: center;
  }
  button:not(:first-child)::after {
    content: '/';
  }
</style>
