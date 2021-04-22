<script lang="ts">
  import { author, wallpaper, tip } from '../stores'
  import fs from '../fs'
  let drive: string = localStorage.getItem('drive') || 'mollerOS'
  $: {
    localStorage.setItem('drive', drive)
    fs.init(drive)
  }
</script>

<main>
  <header>
    <img src="icon.svg" alt="mollerOS icon" />
    <h1>mollerOS settings</h1>
  </header>
  <label>
    Wallpaper
    <select bind:value={$wallpaper}>
      <option>v3</option>
      <option>bliss</option>
      <option>upleft</option>
      <option>gradient</option>
      <option value="mollersuite">mollersuite (WARNING: THIS IS 8K)</option>
    </select>
  </label>
  <label>
    Git author
    <input type="text" bind:value={$author.name} />
  </label>
  <label>
    Git email
    <input type="email" bind:value={$author.email} />
  </label>
  <label>
    FS drive
    <input type="text" bind:value={drive} />
  </label>
  <label>
    Display tip when no windows are open
    <input type="checkbox" bind:checked={$tip} />
  </label>
</main>

<style>
  header {
    text-align: center;
  }
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
