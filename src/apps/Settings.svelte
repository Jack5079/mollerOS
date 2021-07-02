<script lang="ts">
  import { author, wallpaper } from '../stores'
  import fs from '../fs'
  let drive: string = localStorage.getItem('drive') || 'mollerOS'
  $: {
    localStorage.setItem('drive', drive)
    fs.init(drive)
  }
</script>

<main>
  <header>
    <span class="material-icons">settings</span>
    <h1>mollerOS settings</h1>
  </header>
  <label>
    Wallpaper
    <select bind:value={$wallpaper}>
      <option>vortex</option>
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
</main>

<style>
  input,
  select {
    max-width: 100%;
  }
  label {
    margin-bottom: 5px;
  }
  header {
    text-align: center;
  }
  main {
    min-width: 100%;
    background: darkslategray;
    color: white;
  }
  @media (prefers-color-scheme: light) {
    main {
      background: white;
      color: darkslategray;
    }
  }
  @media (prefers-color-scheme: dark) {
    input, select {
      background: darkslategray;
      color: white;
      box-shadow: inset 0 0 5px white;
      padding: .5em;
      border-radius: 1em;
      border: 0;
      transition: box-shadow .5s;
    }
    input:focus, select:focus {
      box-shadow: inset 0 0 5px blue;
      background: darkslategray;
      color: white;
      border: 0;
    }
  }
  span {
    font-size: 100px;
    animation: turn 5s linear infinite;
  }

  @keyframes turn {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(1turn)
    }
  }
</style>
