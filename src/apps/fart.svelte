<script>
  let count = 0
</script>

<main>
  you have shidded and farded <button
    on:click={() => {
      count++
      new window.Audio(
        'https://www.myinstants.com/media/sounds/perfect-fart.mp3'
      ).play()
    }}
  >
    {count}
  </button>
  times
  {#each Array(count).fill() as _}
    <br />Pain.
  {/each}
</main>

<style>
  main {
    min-width: 100%;
    display: grid;
    place-items: center;
    font-family: 'Comic Sans MS';
    color: yellow;
    background: red;
  }
</style>
