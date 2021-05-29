<script lang="ts">
  import LightningFS from '@jkearl/lightning-fs'

  function reset() {
    localStorage.clear()
    new LightningFS(localStorage.getItem('drive') || 'mollerOS', { wipe: true })
    location.reload()
  }
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<main>
  <article>
    Are you sure you want to reset mollerOS? All settings, and files on your
    current drive will be lost.<br />
    <button on:click={reset}>RESET</button>
  </article>
</main>

<style>
  button {
    background: rgb(201, 71, 71);
    color: white;
    border: 0;
    cursor: pointer;
  }
  button:hover,
  button:focus {
    background: rgb(182, 97, 97);
  }
  button:active {
    color: rgb(182, 97, 97);
    background: white;
  }
  main {
    background: black;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 100%;
    text-align: center;
  }
  @media (prefers-color-scheme: light) {
    main {
      background: white;
      color: black;
    }
  }
</style>
