<script>
  import { wallpaper } from '../stores'
  $: {
    localStorage.setItem('wallpaper', $wallpaper)
  }
</script>

<main>
  <h1>mollerOS settings</h1>
  <label>
    Wallpaper
    <select bind:value={$wallpaper}>
      <option>bliss</option>
      <option>upleft</option>
      <option>gradient</option>
      <option value="mollersuite">mollersuite (WARNING: THIS IS 8K)</option>
    </select>
  </label>
</main>

<style>
  main {
    width: 100%;
    background: black;
    color: white;
  }
  @media (prefers-color-scheme: light) {
    main {
      background: white;
      color: black;
    }
  }
</style>
